"use client";

import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { Card } from "@/components/Card";
import { getDoctorBySlug } from "@/lib/doctorsData";

export default function DoctorProfilePage({
  params,
}: {
  params: { slug: string };
}) {
  const doctor = getDoctorBySlug(params.slug);
  const router = useRouter();
  
  if (!doctor) return notFound();

  const handleBooking = () => {
    router.push("/#booking");
    setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent("fps:go", {
          detail: { index: 6 },
        })
      );
    }, 100);
  };

  return (
    <div className="w-full">
      {/* Hero with same gradient as main sections */}
      <div
        className="py-16 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #ffffff 0%, #c5d1d6 30%, #c5d1d6 70%, #ffffff 100%)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 40%, rgba(197, 209, 214, 0.2) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(197, 209, 214, 0.15) 100%)",
          }}
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-800">{doctor.name}</h1>
            <p className="text-lg sm:text-xl text-gray-600 font-medium">{doctor.role}</p>
          </div>
        </div>
      </div>

      <div
        className="py-16"
        style={{
          background:
            "linear-gradient(135deg, #ffffff 0%, #c5d1d6 30%, #c5d1d6 70%, #ffffff 100%)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile card */}
            <div className="lg:col-span-1">
              <Card shadow="md" className="overflow-hidden">
                <div className="w-full aspect-[3/4] bg-gray-100 overflow-hidden rounded-lg">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-5">
                  <h2 className="text-2xl font-bold text-gray-900">{doctor.name}</h2>
                  <p className="text-gray-700 font-semibold mt-1">{doctor.role}</p>

                  <div className="mt-5">
                    <button
                      onClick={handleBooking}
                      className="w-full inline-flex items-center justify-center px-5 py-3 rounded-full bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors"
                    >
                      احجز موعد
                    </button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Details */}
            <div className="lg:col-span-2 space-y-8">
              <Card shadow="md">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">نبذة</h3>
                <p className="text-gray-700 leading-relaxed text-lg">{doctor.bio}</p>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card shadow="sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">التخصصات</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    {doctor.specialties.map((s) => (
                      <li key={s} className="text-base">
                        {s}
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card shadow="sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">اللغات</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    {doctor.languages.map((l) => (
                      <li key={l} className="text-base">
                        {l}
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>

              <Card shadow="md" className="bg-white/60 backdrop-blur-sm">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">ملاحظة</h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  إذا كنت ترغب بحجز استشارة مع الطبيب، استخدم زر "احجز موعد" للانتقال إلى صفحة الحجز.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
