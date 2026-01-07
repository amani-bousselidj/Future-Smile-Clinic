import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/Card";
import { getDoctorBySlug } from "@/lib/doctorsData";

export default function DoctorProfilePage({
  params,
}: {
  params: { slug: string };
}) {
  const doctor = getDoctorBySlug(params.slug);
  if (!doctor) return notFound();

  return (
    <div className="w-full">
      {/* Hero */}
      <div className="bg-gradient-to-l from-blue-600 via-blue-700 to-blue-800 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-16 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl" />
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col gap-4">
            <Link href="/" className="text-blue-100 hover:text-white text-sm w-fit">
              العودة للرئيسية
            </Link>
            <h1 className="text-4xl sm:text-5xl font-bold">{doctor.name}</h1>
            <p className="text-lg sm:text-xl text-blue-100 font-medium">{doctor.role}</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
                <p className="text-blue-700 font-semibold mt-1">{doctor.role}</p>

                <div className="mt-5 flex gap-3">
                  <Link
                    href="/appointments"
                    className="inline-flex items-center justify-center px-5 py-3 rounded-full bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors"
                  >
                    احجز موعد
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center px-5 py-3 rounded-full bg-white border border-gray-300 text-gray-900 font-semibold hover:bg-gray-50 transition-colors"
                  >
                    تواصل معنا
                  </Link>
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

            <Card shadow="md" className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">ملاحظة</h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                إذا كنت ترغب بحجز استشارة مع الطبيب، استخدم زر "احجز موعد" أو تواصل معنا لتحديد الوقت المناسب.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
