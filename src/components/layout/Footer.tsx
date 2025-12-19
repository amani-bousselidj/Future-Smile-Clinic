import Link from "next/link";
import NextImage from "next/image";
import {
  FaTooth,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <NextImage
                  src="/images/logo.png"
                  alt="Future Smile Clinic Logo"
                  width={50}
                  height={50}
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold">ابتسامة المستقبل</h3>
                <p className="text-xs text-gray-400">Future Smile Clinic</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              نحن نعتني بابتسامتك بأحدث التقنيات وبأفضل الخبراء. عيادتك الموثوقة
              لصحة الأسنان والجمال.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="bg-primary-light p-2 rounded-full hover:bg-primary-dark transition"
              >
                <FaFacebook />
              </a>
              <a
                href="#"
                className="bg-primary-light p-2 rounded-full hover:bg-primary-dark transition"
              >
                <FaInstagram />
              </a>
              <a
                href="#"
                className="bg-primary-light p-2 rounded-full hover:bg-primary-dark transition"
              >
                <FaTwitter />
              </a>
              <a
                href="#"
                className="bg-primary-light p-2 rounded-full hover:bg-primary-dark transition"
              >
                <FaLinkedin />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">روابط سريعة</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-primary-light transition"
                >
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-primary-light transition"
                >
                  من نحن
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-gray-400 hover:text-primary-light transition"
                >
                  خدماتنا
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-gray-400 hover:text-primary-light transition"
                >
                  المقالات
                </Link>
              </li>
              <li>
                <Link
                  href="/appointment"
                  className="text-gray-400 hover:text-primary-light transition"
                >
                  احجز موعد
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-bold mb-4">خدماتنا</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/services#whitening"
                  className="text-gray-400 hover:text-primary-light transition"
                >
                  تبييض الأسنان
                </Link>
              </li>
              <li>
                <Link
                  href="/services#braces"
                  className="text-gray-400 hover:text-primary-light transition"
                >
                  تركيب التقويم
                </Link>
              </li>
              <li>
                <Link
                  href="/services#cavity"
                  className="text-gray-400 hover:text-primary-light transition"
                >
                  علاج التسوس
                </Link>
              </li>
              <li>
                <Link
                  href="/services#implants"
                  className="text-gray-400 hover:text-primary-light transition"
                >
                  زراعة الأسنان
                </Link>
              </li>
              <li>
                <Link
                  href="/services#fillings"
                  className="text-gray-400 hover:text-primary-light transition"
                >
                  حشوات تجميلية
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-4">تواصل معنا</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-400">
                <FaMapMarkerAlt className="text-primary-light mt-1" />
                <span>الجزائر العاصمة، شارع ديدوش مراد</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <FaPhone className="text-primary-light" />
                <a
                  href="tel:+213555123456"
                  className="hover:text-primary-light transition"
                >
                  +213 555 123 456
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <FaEnvelope className="text-primary-light" />
                <a
                  href="mailto:contact@futuresmile.dz"
                  className="hover:text-primary-light transition"
                >
                  contact@futuresmile.dz
                </a>
              </li>
            </ul>
            <div className="mt-4">
              <p className="text-sm text-gray-400 mb-2">مواعيد العمل:</p>
              <p className="text-sm text-gray-400">
                السبت - الخميس: 9:00 - 18:00
              </p>
              <p className="text-sm text-gray-400">الجمعة: مغلق</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>
            &copy; {new Date().getFullYear()} ابتسامة المستقبل - Future Smile
            Clinic. جميع الحقوق محفوظة.
          </p>
          <p className="mt-2">
            <Link
              href="/privacy"
              className="hover:text-primary-light transition mx-2"
            >
              سياسة الخصوصية
            </Link>
            |
            <Link
              href="/terms"
              className="hover:text-primary-light transition mx-2"
            >
              الشروط والأحكام
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
