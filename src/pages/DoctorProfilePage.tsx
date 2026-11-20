import { useEffect, type MouseEvent } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  AtSign,
  CalendarDays,
  Clock3,
  MapPin,
  Navigation,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { ToothMark } from "../components/ToothMark";
import { doctors, type Doctor } from "../data/doctors";
import { withBase } from "../utils/routes";

interface DoctorProfilePageProps {
  doctor: Doctor;
  onNavigate: (path: string) => void;
}

export function DoctorProfilePage({ doctor, onNavigate }: DoctorProfilePageProps) {
  const otherDoctors = doctors.filter((item) => item.slug !== doctor.slug);

  useEffect(() => {
    document.title = `${doctor.name} | ${doctor.role} | دندانپزشکی نن‌دخدون`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", doctor.seoDescription);
    }
  }, [doctor]);

  const handleLinkClick = (event: MouseEvent<HTMLAnchorElement>, path: string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }
    event.preventDefault();
    onNavigate(path);
  };

  const scrollToAppointments = () => {
    document.getElementById("doctor-appointment")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main dir="rtl" className="min-h-screen overflow-hidden bg-[#faf8f2] text-[#173f3a]">
      <header className="bg-[#173f3a] text-white">
        <div className="mx-auto flex max-w-[1300px] items-center justify-between gap-4 px-5 py-6 md:px-10">
          <a
            href={withBase("/")}
            onClick={(e) => handleLinkClick(e, "/")}
            className="flex items-center gap-3 text-right"
          >
            <ToothMark />
            <span className="leading-tight">
              <b className="block text-xl">نن‌دخدون</b>
              <small className="text-white/65">مرکز تخصصی دندانپزشکی</small>
            </span>
          </a>

          <div className="flex items-center gap-3">
            <a
              href={withBase("/#doctors")}
              onClick={(e) => handleLinkClick(e, "/#doctors")}
              className="hidden items-center gap-2 rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10 sm:inline-flex"
            >
              <ArrowRight size={16} aria-hidden="true" />
              بازگشت به پزشکان
            </a>
            <button
              type="button"
              onClick={scrollToAppointments}
              className="rounded-full bg-[#edaa7f] px-5 py-2.5 text-sm font-bold text-[#173f3a] transition hover:bg-white"
            >
              دریافت نوبت
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[1300px] px-5 pb-20 pt-10 md:px-10 md:pb-28 md:pt-14">
        <nav aria-label="مسیر صفحه" className="mb-10 flex flex-wrap items-center gap-2 text-sm text-[#687873]">
          <a
            href={withBase("/")}
            onClick={(e) => handleLinkClick(e, "/")}
            className="transition hover:text-[#173f3a]"
          >
            خانه
          </a>
          <span aria-hidden="true">/</span>
          <a
            href={withBase("/#doctors")}
            onClick={(e) => handleLinkClick(e, "/#doctors")}
            className="transition hover:text-[#173f3a]"
          >
            پزشکان ما
          </a>
          <span aria-hidden="true">/</span>
          <span className="font-semibold text-[#173f3a]">{doctor.name}</span>
        </nav>

        <div className="grid items-center gap-12 lg:grid-cols-[.85fr_1.15fr] lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative mx-auto w-full max-w-md lg:max-w-none"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-[11rem] rounded-b-[2rem] bg-[#efe7da] shadow-2xl shadow-[#173f3a]/12">
              <img
                src={doctor.img}
                alt={doctor.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0d302d]/85 via-[#0d302d]/20 to-transparent p-6 pt-24">
                <span className="inline-block rounded-full bg-[#edaa7f] px-4 py-1.5 text-sm font-bold text-[#173f3a]">
                  {doctor.exp}
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            <p className="eyebrow">معرفی پزشک</p>
            <h1 className="section-title mt-3 text-[#173f3a]">{doctor.name}</h1>
            <p className="mt-4 text-xl font-bold text-[#c56f50] md:text-2xl">{doctor.role}</p>
            <p className="mt-7 max-w-2xl text-lg leading-9 text-[#4e625d]">{doctor.intro}</p>

            <div className="mt-8 rounded-[2rem] border border-[#173f3a]/12 bg-white/80 p-7 md:p-8">
              <h2 className="text-xl font-extrabold text-[#173f3a]">سوابق و افتخارات حرفه‌ای</h2>
              <ul className="mt-5 space-y-3.5">
                {doctor.bio.map((line, index) => (
                  <li key={index} className="flex items-start gap-3 text-base leading-8 text-[#4e625d]">
                    <span className="mt-3.5 h-2 w-2 shrink-0 rounded-full bg-[#edaa7f]" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>

              <h3 className="mt-8 text-base font-extrabold text-[#173f3a]">حوزه‌های تخصصی و تمرکز درمان</h3>
              <ul className="mt-4 flex flex-wrap gap-2.5" aria-label="حوزه‌های تخصصی">
                {doctor.focusAreas.map((area) => (
                  <li
                    key={area}
                    className="rounded-full border border-[#173f3a]/15 bg-[#faf8f2] px-4 py-2 text-sm font-semibold text-[#173f3a]"
                  >
                    {area}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-9 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={scrollToAppointments}
                className="group inline-flex items-center gap-4 rounded-full bg-[#173f3a] px-7 py-4 font-bold text-white transition hover:bg-[#c56f50]"
              >
                دریافت نوبت با {doctor.name}
                <ArrowLeft size={19} className="transition group-hover:-translate-x-1" aria-hidden="true" />
              </button>
              <a
                href={withBase("/#doctors")}
                onClick={(e) => handleLinkClick(e, "/#doctors")}
                className="inline-flex items-center gap-3 rounded-full border border-[#173f3a]/25 px-7 py-4 font-bold text-[#173f3a] transition hover:border-[#173f3a] hover:bg-[#173f3a] hover:text-white"
              >
                مشاهده همه پزشکان
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-y border-[#173f3a]/10 bg-[#f4e7da]/55 py-16 md:py-20">
        <div className="mx-auto grid max-w-[1300px] gap-6 px-5 md:grid-cols-3 md:px-10">
          <div className="rounded-3xl bg-white/80 p-7">
            <ShieldCheck className="text-[#c56f50]" size={26} aria-hidden="true" />
            <h2 className="mt-4 text-lg font-extrabold">معاینه دقیق و طرح درمان شفاف</h2>
            <p className="mt-2 leading-8 text-[#5f6f6a]">
              پیش از آغاز درمان، تمامی گزینه‌ها، مراحل و زمان‌بندی به‌صورت کامل و شفاف توضیح داده می‌شود.
            </p>
          </div>
          <div className="rounded-3xl bg-white/80 p-7">
            <Sparkles className="text-[#c56f50]" size={26} aria-hidden="true" />
            <h2 className="mt-4 text-lg font-extrabold">حفظ بافت طبیعی و آرامش بیمار</h2>
            <p className="mt-2 leading-8 text-[#5f6f6a]">
              اولویت در تمامی جلسات درمانی، انجام کار با دقت بالا، کمترین میزان استرس و حفظ سلامت ماندگار دندان است.
            </p>
          </div>
          <div className="rounded-3xl bg-white/80 p-7">
            <Clock3 className="text-[#c56f50]" size={26} aria-hidden="true" />
            <h2 className="mt-4 text-lg font-extrabold">هماهنگی منظم و احترام به زمان</h2>
            <p className="mt-2 leading-8 text-[#5f6f6a]">
              پذیرش همه‌روزه از ساعت ۱۰ صبح تا ۸ شب با هماهنگی قبلی برای جلوگیری از معطلی شما انجام می‌شود.
            </p>
          </div>
        </div>
      </section>

      <section id="doctor-appointment" className="scroll-mt-8 bg-[#173f3a] text-white">
        <div className="mx-auto grid max-w-[1300px] gap-10 px-5 py-16 md:px-10 md:py-20 lg:grid-cols-[.8fr_1.2fr] lg:items-center lg:gap-20">
          <div>
            <p className="eyebrow !text-[#edaa7f]">رزرو نوبت</p>
            <h2 className="mt-3 text-3xl font-black leading-[1.4] md:text-4xl">
              هماهنگی وقت با {doctor.name}
            </h2>
            <p className="mt-4 max-w-md leading-8 text-white/65">
              برای دریافت نوبت و هماهنگی، با شماره ویژه{" "}
              {doctor.appointmentType === "children" ? "دندانپزشکی کودکان" : "دندانپزشکی بزرگسالان"} یا بخش
              مربوطه تماس بگیرید.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <a
              href="tel:+989013770151"
              className={`group flex min-h-36 items-center justify-between gap-4 border px-6 py-6 transition hover:border-[#edaa7f] hover:bg-white/5 ${
                doctor.appointmentType === "adults" ? "border-[#edaa7f] bg-white/5" : "border-white/20"
              }`}
              aria-label="تماس برای رزرو نوبت دندانپزشکی بزرگسالان"
            >
              <span>
                <span className="block text-sm text-white/60">رزرو نوبت</span>
                <span className="mt-1 block text-lg font-bold">دندانپزشکی بزرگسالان</span>
                <span dir="ltr" className="mt-3 block text-xl font-semibold tracking-wide text-[#edaa7f]">
                  ۰۹۰۱ ۳۷۷ ۰۱۵۱
                </span>
              </span>
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#edaa7f] text-[#173f3a] transition group-hover:scale-105">
                <Phone size={19} aria-hidden="true" />
              </span>
            </a>

            <a
              href="tel:+989901303881"
              className={`group flex min-h-36 items-center justify-between gap-4 border px-6 py-6 transition hover:border-[#edaa7f] hover:bg-white/5 ${
                doctor.appointmentType === "children" ? "border-[#edaa7f] bg-white/5" : "border-white/20"
              }`}
              aria-label="تماس برای رزرو نوبت دندانپزشکی کودکان"
            >
              <span>
                <span className="block text-sm text-white/60">رزرو نوبت</span>
                <span className="mt-1 block text-lg font-bold">دندانپزشکی کودکان</span>
                <span dir="ltr" className="mt-3 block text-xl font-semibold tracking-wide text-[#edaa7f]">
                  ۰۹۹۰ ۱۳۰ ۳۸۸۱
                </span>
              </span>
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#edaa7f] text-[#173f3a] transition group-hover:scale-105">
                <Phone size={19} aria-hidden="true" />
              </span>
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1300px] px-5 py-20 md:px-10 md:py-28">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">تیم پزشکی نن‌دخدون</p>
            <h2 className="mt-3 text-3xl font-black md:text-4xl">سایر پزشکان کلینیک</h2>
          </div>
          <a
            href={withBase("/#doctors")}
            onClick={(e) => handleLinkClick(e, "/#doctors")}
            className="inline-flex w-fit items-center gap-2 text-sm font-bold text-[#c56f50] transition hover:text-[#173f3a]"
          >
            مشاهده در صفحه اصلی
            <ArrowLeft size={16} aria-hidden="true" />
          </a>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {otherDoctors.map((other) => (
            <article
              key={other.slug}
              className="group flex flex-col overflow-hidden rounded-[2rem] border border-[#173f3a]/12 bg-white/75"
            >
              <a
                href={withBase(`/doctors/${other.slug}`)}
                onClick={(e) => handleLinkClick(e, `/doctors/${other.slug}`)}
                className="relative aspect-[4/3] overflow-hidden bg-[#efe7da]"
              >
                <img
                  src={other.img}
                  alt={other.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0d302d]/85 via-[#0d302d]/15 to-transparent p-4 pt-16">
                  <span className="rounded-full bg-[#edaa7f] px-3 py-1 text-xs font-bold text-[#173f3a]">
                    {other.exp}
                  </span>
                </div>
              </a>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-xl font-extrabold">{other.name}</h3>
                <p className="mt-1 text-sm font-medium text-[#c56f50]">{other.role}</p>
                <a
                  href={withBase(`/doctors/${other.slug}`)}
                  onClick={(e) => handleLinkClick(e, `/doctors/${other.slug}`)}
                  className="mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-[#173f3a]/20 px-4 py-2 text-sm font-bold transition hover:border-[#173f3a] hover:bg-[#173f3a] hover:text-white"
                >
                  مشاهده پروفایل
                  <ArrowLeft size={15} aria-hidden="true" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="bg-[#0d302d] px-5 pb-8 pt-16 text-white md:px-10 md:pt-24">
        <div className="mx-auto max-w-[1300px]">
          <div className="grid gap-12 border-b border-white/15 pb-14 md:grid-cols-[1.1fr_.9fr]">
            <div>
              <a
                href={withBase("/")}
                onClick={(e) => handleLinkClick(e, "/")}
                className="inline-flex items-center gap-3"
              >
                <ToothMark />
                <b className="text-3xl">نن‌دخدون</b>
              </a>
              <p className="mt-6 max-w-xl text-2xl font-black leading-[1.6] md:text-4xl">
                لبخند بعدی، می‌تواند لبخند شما باشد.
              </p>
              <button
                type="button"
                onClick={scrollToAppointments}
                className="mt-8 inline-flex items-center gap-4 rounded-full bg-[#edaa7f] px-7 py-4 font-bold text-[#173f3a] transition hover:bg-white"
              >
                دریافت نوبت
                <CalendarDays size={20} aria-hidden="true" />
              </button>
            </div>

            <div className="space-y-6 self-end text-white/75">
              <a href="tel:+982122577341" className="flex items-center gap-4 transition hover:text-white">
                <Phone className="text-[#edaa7f]" aria-hidden="true" />
                ۰۲۱-۲۲۵۷۷۳۴۱ موارد غیر رزرو وقت
              </a>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <MapPin className="mt-1 shrink-0 text-[#edaa7f]" aria-hidden="true" />
                  تهران، خیابان کلاهدوز (دولت)، ساختمان پزشکان نرگس
                </div>
                <div className="flex flex-wrap gap-2.5 pr-10" aria-label="مسیریابی">
                  <a
                    href="https://maps.app.goo.gl/FPdRnaCgJ8hoBtsm9"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="مسیریابی با گوگل مپ"
                    className="group inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-sm font-semibold text-white transition hover:border-[#edaa7f] hover:bg-[#edaa7f] hover:text-[#173f3a]"
                  >
                    <Navigation size={15} className="text-[#edaa7f] transition group-hover:text-[#173f3a]" aria-hidden="true" />
                    گوگل مپس
                  </a>
                  <a
                    href="https://nshn.ir/ac_bv7uXGxuI-C"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="مسیریابی با نشان"
                    className="group inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-sm font-semibold text-white transition hover:border-[#edaa7f] hover:bg-[#edaa7f] hover:text-[#173f3a]"
                  >
                    <Navigation size={15} className="text-[#edaa7f] transition group-hover:text-[#173f3a]" aria-hidden="true" />
                    نشان
                  </a>
                  <a
                    href="https://balad.ir/p/6go2YO9Hwll6w5"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="مسیریابی با بلد"
                    className="group inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-sm font-semibold text-white transition hover:border-[#edaa7f] hover:bg-[#edaa7f] hover:text-[#173f3a]"
                  >
                    <Navigation size={15} className="text-[#edaa7f] transition group-hover:text-[#173f3a]" aria-hidden="true" />
                    بلد
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Clock3 className="text-[#edaa7f]" aria-hidden="true" />
                همه‌روزه ساعت ۱۰ صبح تا ۸ شب با هماهنگی قبلی
              </div>
              <a href="#" className="flex items-center gap-4 transition hover:text-white">
                <AtSign className="text-[#edaa7f]" aria-hidden="true" />
                nandakhdoon
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-7 text-xs text-white/45 sm:flex-row sm:justify-between">
            <p>© ۱۴۰۴ کلینیک دندانپزشکی نن‌دخدون</p>
            <p>تمام حقوق محفوظ است.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
