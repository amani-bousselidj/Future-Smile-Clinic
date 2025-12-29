/**
 * Privacy Policy Page - Arabic Version
 */
export default function PrivacyPolicyPage() {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-gradient-to-l from-blue-600 via-blue-700 to-blue-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold">سياسة الخصوصية</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="space-y-10 text-gray-700">
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              1. المقدمة
            </h2>
            <p className="text-lg leading-relaxed">
              عيادة ابتسامة المستقبل ("نحن" و "الشركة") تحرص على حماية خصوصيتك.
              توضح هذه الصفحة سياستنا بشأن جمع واستخدام والإفصاح عن البيانات
              الشخصية عند استخدام خدماتنا والخيارات المتاحة لك.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              2. جمع واستخدام المعلومات
            </h2>
            <p className="text-lg leading-relaxed mb-4">
              نجمع عدة أنواع مختلفة من المعلومات لأغراض مختلفة لتوفير وتحسين
              خدمتنا لك.
            </p>
            <ul className="list-disc list-inside space-y-3 text-lg">
              <li>
                البيانات الشخصية: الاسم، البريد الإلكتروني، رقم الهاتف، تاريخ
                الميلاد، السجل الطبي
              </li>
              <li>
                بيانات الاستخدام: نوع المتصفح، الصفحات المزارة، التاريخ والوقت
              </li>
              <li>ملفات تعريف الارتباط: ملفات صغيرة لتحسين تجربتك</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              3. استخدام البيانات
            </h2>
            <p className="text-lg leading-relaxed mb-4">
              تستخدم عيادة ابتسامة المستقبل البيانات المجمعة لعدة أغراض:
            </p>
            <ul className="list-disc list-inside space-y-3 text-lg">
              <li>توفير والحفاظ على خدمتنا</li>
              <li>إخطارك بالتغييرات على خدمتنا</li>
              <li>السماح لك بالمشاركة في الميزات التفاعلية</li>
              <li>توفير دعم العملاء</li>
              <li>تحسين وتطوير خدماتنا بناءً على البيانات المجمعة</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              4. أمان البيانات
            </h2>
            <p className="text-lg leading-relaxed">
              أمان بياناتك مهم لنا. ومع ذلك، لا توجد طريقة نقل عبر الإنترنت أو
              تخزين إلكتروني آمنة بنسبة 100%. بينما نسعى جاهدين لاستخدام طرق
              مقبولة تجارياً لحماية بيانتك الشخصية، لا يمكننا ضمان أمانها
              المطلق.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">5. حقوقك</h2>
            <p className="text-lg leading-relaxed mb-4">لك الحق في:</p>
            <ul className="list-disc list-inside space-y-3 text-lg">
              <li>الوصول إلى بيانتك الشخصية</li>
              <li>تصحيح البيانات غير الدقيقة</li>
              <li>طلب حذف بيانتك</li>
              <li>الاعتراض على معالجة بيانتك</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              6. الاتصال بنا
            </h2>
            <p className="text-lg leading-relaxed">
              إذا كان لديك أسئلة حول سياسة الخصوصية هذه، يرجى الاتصال بنا على:
            </p>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-lg">البريد الإلكتروني: info@futuresmile.com</p>
              <p className="text-lg mt-2">الهاتف: +966 12 345 6789</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
