import { useState, useEffect, useCallback, useRef } from "react";

interface QueueItem {
  id: number;
  booking_id: string;
  patient_name: string;
  service_name: string;
  appointment_status: string;
  queue_position: number;
  estimated_wait_minutes: number;
  actual_wait_minutes: number | null;
  scheduled_start_time: string;
  actual_start_time: string | null;
}

interface QueueTrackerData {
  items: QueueItem[];
  currentUserPosition: number | null;
  currentUserWaitTime: number | null;
  totalInQueue: number;
  nextUserPosition: number | null;
  nextUserName: string | null;
}

export const useQueueTracker = (bookingId?: string) => {
  const [data, setData] = useState<QueueTrackerData>({
    items: [],
    currentUserPosition: null,
    currentUserWaitTime: null,
    totalInQueue: 0,
    nextUserPosition: null,
    nextUserName: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchQueueData = useCallback(async () => {
    try {
      const apiBase =
        process.env.NEXT_PUBLIC_API_URL ||
        "https://future-smile-clinic.onrender.com/api";

      // جلب الطابور الحالي
      const response = await fetch(
        `${apiBase}/queue-history/current_queue/?limit=50`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error("فشل تحميل بيانات الطابور");
      }

      const responseData = await response.json();
      const items = Array.isArray(responseData)
        ? responseData
        : responseData.results || [];

      // البحث عن موضع المستخدم الحالي
      let userPosition = null;
      let userWaitTime = null;
      let nextPosition = null;
      let nextName = null;

      if (bookingId && items.length > 0) {
        const userItem = items.find(
          (item: QueueItem) => item.booking_id === bookingId
        );
        if (userItem) {
          userPosition = userItem.queue_position;
          userWaitTime = userItem.estimated_wait_minutes;

          // البحث عن الموعد التالي
          const nextItem = items.find(
            (item: QueueItem) => item.queue_position === userPosition! + 1
          );
          if (nextItem) {
            nextPosition = nextItem.queue_position;
            nextName = nextItem.patient_name;
          }
        }
      }

      setData({
        items,
        currentUserPosition: userPosition,
        currentUserWaitTime: userWaitTime,
        totalInQueue: items.length,
        nextUserPosition: nextPosition,
        nextUserName: nextName,
      });

      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ في جلب البيانات");
      console.error("Queue tracker error:", err);
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  // جلب البيانات في البداية
  useEffect(() => {
    fetchQueueData();
  }, [fetchQueueData]);

  // تحديث تلقائي كل 5 ثوان
  useEffect(() => {
    intervalRef.current = setInterval(fetchQueueData, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchQueueData]);

  // إعادة تحميل يدوية
  const refetch = useCallback(() => {
    setLoading(true);
    fetchQueueData();
  }, [fetchQueueData]);

  // إيقاف المراقبة
  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  // استئناف المراقبة
  const resume = useCallback(() => {
    intervalRef.current = setInterval(fetchQueueData, 5000);
  }, [fetchQueueData]);

  return {
    ...data,
    loading,
    error,
    lastUpdated,
    refetch,
    stop,
    resume,
  };
};
