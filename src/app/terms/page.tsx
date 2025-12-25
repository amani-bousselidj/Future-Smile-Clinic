import { Metadata } from "next";

export const metadata: Metadata = {
  title: "شروط الخدمة - عيادة الابتسامة المستقبلية",
  description: "شروط الخدمة لعيادة الابتسامة المستقبلية",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">شروط الخدمة</h1>

        <div className="prose prose-lg text-gray-700 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              1. الاتفاق على الشروط
            </h2>
            <p>
              باستخدام موقعنا والخدمات الطبية، فإنك توافق على جميع شروط الخدمة
              هذه. إذا لم توافق على أي من هذه الشروط، يرجى عدم استخدام خدماتنا.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              2. الخدمات الطبية
            </h2>
            <p>
              جميع الخدمات المقدمة من قبل عيادة الابتسامة المستقبلية يتم تقديمها
              من قبل متخصصين مؤهلين. نحن نلتزم بأعلى معايير الرعاية الطبية.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              3. المسؤولية
            </h2>
            <p>
              العميل مسؤول عن دقة المعلومات المقدمة. نحن لسنا مسؤولين عن:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>المعلومات غير الدقيقة المقدمة من قبلك</li>
              <li>أي مضاعفات ناتجة عن عدم الامتثال لتعليماتنا</li>
              <li>الأضرار الناجمة عن استخدام الموقع بشكل غير صحيح</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              4. المواعيد
            </h2>
            <p>
              يجب حجز المواعيد مسبقاً. في حالة الإلغاء، يرجى إخطارنا بـ 24 ساعة
              على الأقل. قد يتم فرض رسوم إلغاء لعدم الظهور.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              5. الدفع والتسعير
            </h2>
            <p>
              جميع الأسعار محددة مسبقاً. ندفع من خلال طرق الدفع الآمنة. يتم قبول
              الدفع نقداً أو بطاقة ائتمان.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              6. حدود المسؤولية
            </h2>
            <p>
              لن نكون مسؤولين عن أي أضرار غير مباشرة أو عرضية أو خاصة ناتجة عن
              استخدامك لخدماتنا.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              7. تعديل الشروط
            </h2>
            <p>
              نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم إخطارك بأي تغييرات
              مهمة.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              8. القانون الحاكم
            </h2>
            <p>
              تحكم هذه الشروط القوانين المحلية والقوانين الدولية المعمول بها.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              9. الاتصال
            </h2>
            <p>
              لأي أسئلة حول شروط الخدمة هذه، يرجى التواصل معنا من خلال صفحة
              الاتصال.
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
