import { Metadata } from "next";

export const metadata: Metadata = {
  title: "سياسة الخصوصية - عيادة الابتسامة المستقبلية",
  description: "سياسة الخصوصية لعيادة الابتسامة المستقبلية",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">سياسة الخصوصية</h1>

        <div className="prose prose-lg text-gray-700 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              1. مقدمة
            </h2>
            <p>
              نحن في عيادة الابتسامة المستقبلية نلتزم بحماية خصوصيتك. تشرح هذه
              السياسة كيفية جمع واستخدام بياناتك الشخصية.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              2. المعلومات التي نجمعها
            </h2>
            <p>نجمع المعلومات التالية:</p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>معلومات الاتصال (الاسم والبريد الإلكتروني والهاتف)</li>
              <li>سجل المواعيد والمعالجات</li>
              <li>البيانات الطبية ذات الصلة</li>
              <li>معلومات المتصفح والجهاز</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              3. استخدام المعلومات
            </h2>
            <p>نستخدم بيانتك لـ:</p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>توفير خدماتنا الطبية والعلاجية</li>
              <li>تحسين تجربتك في عيادتنا</li>
              <li>التواصل معك بشأن المواعيد والخدمات</li>
              <li>الامتثال للمتطلبات القانونية</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              4. حماية البيانات
            </h2>
            <p>
              نحن نستخدم معايير أمان عالية لحماية معلوماتك الشخصية. جميع
              البيانات مشفرة وآمنة.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              5. حقوقك
            </h2>
            <p>لديك الحق في:</p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>الوصول إلى بياناتك الشخصية</li>
              <li>تعديل بياناتك</li>
              <li>حذف بياناتك</li>
              <li>الاعتراض على معالجة بياناتك</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              6. الاتصال بنا
            </h2>
            <p>
              إذا كان لديك أسئلة حول هذه السياسة، يرجى التواصل معنا من خلال
              صفحة الاتصال.
            </p>
          </section>

          <section>
            <p className="text-sm text-gray-600 mt-8">
              آخر تحديث: {new Date().toLocaleDateString("ar-EG")}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
