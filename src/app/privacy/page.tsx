/**
 * Privacy Policy Page - Redesigned to match main site style
 */
export default function PrivacyPolicyPage() {
  return (
    <div className="w-full">
      {/* Header with gradient background */}
      <div
        className="relative overflow-hidden pt-32 pb-16"
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 text-center">سياسة الخصوصية</h1>
          <p className="text-lg text-gray-600 text-center mt-4">نحرص على حماية خصوصيتك وبياناتك الشخصية</p>
        </div>
      </div>

      <div
        className="py-16"
        style={{
          background:
            "linear-gradient(135deg, #ffffff 0%, #c5d1d6 30%, #c5d1d6 70%, #ffffff 100%)",
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <div className="backdrop-blur-md bg-white/70 rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                1. المقدمة
              </h2>
              <p className="text-base leading-relaxed text-gray-700">
                عيادة ابتسامة المستقبل ("نحن" و "الشركة") تحرص على حماية خصوصيتك.
                توضح هذه الصفحة سياستنا بشأن جمع واستخدام والإفصاح عن البيانات
                الشخصية عند استخدام خدماتنا والخيارات المتاحة لك.
              </p>
            </div>

            <div className="backdrop-blur-md bg-white/70 rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                2. جمع واستخدام المعلومات
              </h2>
              <p className="text-base leading-relaxed text-gray-700 mb-4">
                نجمع عدة أنواع مختلفة من المعلومات لأغراض مختلفة لتوفير وتحسين
                خدمتنا لك.
              </p>
              <ul className="list-disc list-inside space-y-2 text-base text-gray-700">
                <li>
                  البيانات الشخصية: الاسم، البريد الإلكتروني، رقم الهاتف، تاريخ
                  الميلاد، السجل الطبي
                </li>
                <li>
                  بيانات الاستخدام: نوع المتصفح، الصفحات المزارة، التاريخ والوقت
                </li>
                <li>ملفات تعريف الارتباط: ملفات صغيرة لتحسين تجربتك</li>
              </ul>
            </div>

            <div className="backdrop-blur-md bg-white/70 rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                3. استخدام البيانات
              </h2>
              <p className="text-base leading-relaxed text-gray-700 mb-4">
                تستخدم عيادة ابتسامة المستقبل البيانات المجمعة لعدة أغراض:
              </p>
              <ul className="list-disc list-inside space-y-2 text-base text-gray-700">
                <li>توفير والحفاظ على خدمتنا</li>
                <li>إخطارك بالتغييرات على خدمتنا</li>
                <li>السماح لك بالمشاركة في الميزات التفاعلية</li>
                <li>توفير دعم العملاء</li>
                <li>تحسين وتطوير خدماتنا بناءً على البيانات المجمعة</li>
              </ul>
            </div>

            <div className="backdrop-blur-md bg-white/70 rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                4. أمان البيانات
              </h2>
              <p className="text-base leading-relaxed text-gray-700">
                أمان بياناتك مهم لنا. ومع ذلك، لا توجد طريقة نقل عبر الإنترنت أو
                تخزين إلكتروني آمنة بنسبة 100%. بينما نسعى جاهدين لاستخدام طرق
                مقبولة تجارياً لحماية بيانتك الشخصية، لا يمكننا ضمان أمانها
                المطلق.
              </p>
            </div>

            <div className="backdrop-blur-md bg-white/70 rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">5. حقوقك</h2>
              <p className="text-base leading-relaxed text-gray-700 mb-4">لك الحق في:</p>
              <ul className="list-disc list-inside space-y-2 text-base text-gray-700">
                <li>الوصول إلى بيانتك الشخصية</li>
                <li>تصحيح البيانات غير الدقيقة</li>
                <li>طلب حذف بيانتك</li>
                <li>الاعتراض على معالجة بيانتك</li>
              </ul>
            </div>

            <div className="backdrop-blur-md bg-white/70 rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                6. الاتصال بنا
              </h2>
              <p className="text-base leading-relaxed text-gray-700 mb-4">
                إذا كان لديك أسئلة حول سياسة الخصوصية هذه، يرجى الاتصال بنا على:
              </p>
              <div className="mt-4 p-6 bg-white/60 rounded-xl border border-white/40">
                <p className="text-base text-gray-800 font-medium">البريد الإلكتروني: info@futuresmile.com</p>
                <p className="text-base text-gray-800 font-medium mt-2">الهاتف: +966 12 345 6789</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
