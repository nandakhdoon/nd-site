import { useEffect, useRef, useState, type MouseEvent } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowLeft, CalendarDays, ChevronDown, ChevronLeft, ChevronRight, Clock3, AtSign, HeartHandshake, MapPin, Maximize2, Menu, Navigation, Pause, Phone, Play, ShieldCheck, Sparkles, X } from "lucide-react";
import { ToothMark } from "./components/ToothMark";
import { doctors, getDoctorBySlug, type Doctor } from "./data/doctors";
import { DoctorProfilePage } from "./pages/DoctorProfilePage";
import { getDoctorSlugFromRoute, getRoutePath, withBase } from "./utils/routes";

const HOME_TITLE = "دندانپزشکی نن‌دخدون | لبخند شبیه خودت";
const HOME_DESCRIPTION = "مرکز تخصصی دندانپزشکی نن‌دخدون؛ تجربه‌ای آرام، دقیق و متفاوت برای لبخند شما.";

const services = [
  { number: "۰۱", title: "خدمات کودکان", text: "محیطی شاد و آرام برای فرزندان شما، تا تجربه‌ای بدون ترس و خوشایند از دندانپزشکی داشته باشند و سلامت دهانشان تضمین شود" },
  { number: "۰۲", title: "ترمیمی", text: "بازسازی دندان‌های پوسیده یا آسیب‌دیده با مواد باکیفیت و همرنگ دندان، برای بازگرداندن زیبایی و کارایی طبیعی آن‌ها" },
  { number: "۰۳", title: "زیبایی", text: "طراحی لبخندی درخشان و جذاب با استفاده از جدیدترین متدهای ونیر کامپوزیت، لمینت سرامیکی و بلیچینگ" },
  { number: "۰۴", title: "عصب‌کشی", text: "درمان تخصصی ریشه (اندو) با تجهیزات پیشرفته برای حفظ دندان طبیعی شما و رهایی همیشگی از درد دندان" },
  { number: "۰۵", title: "پروتز", text: "جایگزینی دندان‌های از دست رفته با انواع روکش‌های ثابت و متحرک، با ظاهری کاملاً طبیعی و دوام بالا" },
  { number: "۰۶", title: "ایمپلنت", text: "کاشت دندان به روش مدرن؛ بهترین و ماندگارترین جایگزین برای دندان‌های از دست رفته با عملکردی مشابه دندان طبیعی" },
  { number: "۰۷", title: "انواع جراحی", text: "انجام جراحی‌های دندان عقل، لثه و سایر جراحی‌های دهانی با میزان درد کم و دوره نقاهت کوتاه" },
  { number: "۰۸", title: "تشخیص بیماری", text: "معاینه دقیق و چکاپ کامل دهان و دندان برای تشخیص زودرس مشکلات و ضایعات با استفاده از تجهیزات تشخیصی دقیق" },
  { number: "۰۹", title: "روانشناسی کودکان", text: "مدیریت رفتار و کاهش اضطراب کودکان قبل از درمان، برای ایجاد حس امنیت و همکاری بهتر آن‌ها در طول دندانپزشکی" },
];
const faqs = [
  ["برای اولین مراجعه چه کاری باید انجام دهم؟", "کافی است از طریق فرم نوبت، زمان مناسب را انتخاب کنید. همکاران ما برای هماهنگی و توضیح مدارک لازم با شما تماس می‌گیرند."],
  ["آیا امکان مشاوره پیش از درمان وجود دارد؟", "بله، تمام درمان‌ها با معاینه کامل، بررسی تصاویر و گفت‌وگو درباره گزینه‌های درمانی، هزینه و زمان‌بندی آغاز می‌شوند."],
  ["کلینیک چه روزهایی فعال است؟", "شنبه تا پنج‌شنبه از ساعت ۹ تا ۲۰ پذیرای شما هستیم. برای موارد ضروری نیز می‌توانید مستقیما با پذیرش تماس بگیرید."],
];

// Sample testimonials; replace with verified patient feedback before publishing.
const reviews = [
  {
    id: "cosmetic",
    name: "مریم احمدی",
    treatment: "مراجعه‌کننده زیبایی",
    quote: "از برخورد حرفه‌ای تیم تا توضیح دقیق تمام مراحل، همه‌چیز باعث شد بدون استرس درمانم را انجام دهم. نتیجه حتی بهتر از چیزی بود که انتظار داشتم.",
  },
  {
    id: "children",
    name: "سارا رضایی",
    treatment: "مادر یکی از مراجعین بخش کودکان",
    quote: "دخترم از دندانپزشکی می‌ترسید، اما صبوری پزشک و برخورد مهربان تیم کمک کرد احساس امنیت کند. برای من مهم بود که به او فرصت بدهند و با زبان خودش توضیح دهند.",
  },
  {
    id: "implant",
    name: "علی محمدی",
    treatment: "مراجعه‌کننده ایمپلنت",
    quote: "پیش از شروع، درباره مراحل درمان و مراقبت‌های بعد از آن کامل صحبت کردیم. هماهنگی منظم جلسات و پاسخ‌گویی به سوال‌هایم باعث شد با خیال راحت‌تری این مسیر را طی کنم.",
  },
  {
    id: "orthodontics",
    name: "نرگس کریمی",
    treatment: "مراجعه‌کننده ارتودنسی",
    quote: "در هر جلسه برای بررسی روند درمان و شنیدن سوال‌هایم وقت گذاشتند. توضیح‌های روشن و پیگیری منظم تیم برایم ارزشمند بود و احساس می‌کردم در تمام مسیر همراه من هستند.",
  },
];


const psychologist = {
  title: "عضو تیم ما، ولی نه دندانپزشک!",
  name: "خانم معصومه سلیمانی",
  role: "روانشناس پویشی و روان‌درمانگر کودک و نوجوان",
  highlight: "سابقه ۱۰ سال کار تخصصی",
  credentials: ["درمان اتیسم و اختلالات رشدی", "محقق کودک", "درمانگر پویشی و MBT", "درمانگر Sandplay Therapy"],
  text: "شاید تعجب کنید، اما سلامت روان و دندان به هم گره خورده‌اند! ما می‌دونیم که ترس یا اضطراب می‌تونه مانع درمان بشه. خانم سلیمانی اینجا هستند تا با تکنیک‌های تخصصی و بازی‌درمانی، فضای دندونپزشکی رو برای فرزندان عزیزتون (به‌ویژه کودکان با شرایط خاص یا دارای اضطراب) امن و آروم کنند تا درمان، بدون اشک و استرس انجام بشه. 😇🥳",
  img: "https://images.pexels.com/photos/8910424/pexels-photo-8910424.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1400&w=1000",
};

function PsychologistSection({ onBook }: { onBook: () => void }) {
  return (
    <section id="psychologist" aria-labelledby="psychologist-heading" className="relative overflow-hidden bg-[#f4e7da]">
      <div aria-hidden="true" className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#edaa7f]/30 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 right-1/3 h-96 w-96 rounded-full bg-white/60 blur-3xl" />
      <div className="relative mx-auto grid max-w-[1300px] items-center gap-14 px-5 py-24 md:px-10 md:py-32 lg:grid-cols-[.85fr_1.15fr] lg:gap-20">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: .7 }} className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="aspect-[4/5] overflow-hidden rounded-[2.5rem] rounded-tr-[11rem] bg-cover bg-center shadow-2xl shadow-[#173f3a]/15" style={{ backgroundImage: `url(${psychologist.img})` }} role="img" aria-label="جلسه بازی‌درمانی روانشناس کودک با یک کودک" />
          <div className="absolute -bottom-6 right-5 flex items-center gap-3 rounded-2xl bg-white px-5 py-3.5 shadow-xl shadow-[#173f3a]/10 md:right-8">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#173f3a] text-[#edaa7f]"><HeartHandshake size={20} aria-hidden="true" /></span>
            <span className="text-sm font-bold leading-tight">{psychologist.highlight}</span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: .7, delay: .1 }}>
          <p className="eyebrow">روانشناس کلینیک</p>
          <h2 id="psychologist-heading" className="section-title mt-4">{psychologist.title}</h2>
          <div className="mt-9 rounded-[2rem] border border-[#173f3a]/10 bg-white/75 p-7 backdrop-blur-sm md:p-9">
            <h3 className="text-2xl font-extrabold md:text-3xl">{psychologist.name}</h3>
            <p className="mt-2 font-semibold text-[#c56f50]">{psychologist.role}</p>
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="تخصص‌ها و سوابق">
              {psychologist.credentials.map((item) => (
                <li key={item} className="rounded-full border border-[#173f3a]/15 bg-[#faf8f2] px-3.5 py-1.5 text-sm font-medium text-[#173f3a]">{item}</li>
              ))}
            </ul>
          </div>
          <p className="mt-8 max-w-2xl text-lg leading-9 text-[#4e625d]">{psychologist.text}</p>
          <button type="button" onClick={onBook} className="mt-9 inline-flex items-center gap-4 rounded-full bg-[#173f3a] px-7 py-4 font-bold text-white transition hover:bg-[#c56f50] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c56f50]">نوبت دندانپزشکی کودکان <ArrowLeft size={19} aria-hidden="true" /></button>
        </motion.div>
      </div>
    </section>
  );
}


const gallery = [
  { src: "https://images.pexels.com/photos/4269268/pexels-photo-4269268.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200", caption: "اتاق درمان اصلی", span: "sm:col-span-2 sm:row-span-2" },
  { src: "https://images.pexels.com/photos/6502336/pexels-photo-6502336.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800", caption: "ابزارهای استریل", span: "" },
  { src: "https://images.pexels.com/photos/38055772/pexels-photo-38055772.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200", caption: "پذیرش کلینیک", span: "" },
  { src: "https://images.pexels.com/photos/5355920/pexels-photo-5355920.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200", caption: "یونیت دندانپزشکی", span: "" },
  { src: "https://images.pexels.com/photos/6627794/pexels-photo-6627794.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800", caption: "پروتکل بهداشت", span: "" },
  { src: "https://images.pexels.com/photos/5355863/pexels-photo-5355863.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200", caption: "فضای درمان کودکان", span: "sm:col-span-2" },
  { src: "https://images.pexels.com/photos/6502557/pexels-photo-6502557.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200", caption: "تجهیزات پیشرفته", span: "" },
  { src: "https://images.pexels.com/photos/30902075/pexels-photo-30902075.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800", caption: "اتاق معاینه دوم", span: "" },
];

function Lightbox({ index, onClose, onNavigate }: { index: number; onClose: () => void; onNavigate: (next: number) => void }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onNavigate((index + 1) % gallery.length);
      if (e.key === "ArrowRight") onNavigate((index - 1 + gallery.length) % gallery.length);
    };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [index, onClose, onNavigate]);

  return (
    <motion.div dir="rtl" className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#071f1d]/92 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <button onClick={onClose} className="absolute left-5 top-5 rounded-full border border-white/25 p-3 text-white transition hover:bg-white hover:text-[#173f3a]" aria-label="بستن"><X /></button>
      <motion.img key={gallery[index].src} src={gallery[index].src} alt={gallery[index].caption} onClick={(e) => e.stopPropagation()} initial={{ opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .25 }} className="max-h-[75vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl" />
      <div className="mt-6 flex items-center gap-6 text-white" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => onNavigate((index + 1) % gallery.length)} className="rounded-full border border-white/25 p-3 transition hover:bg-white hover:text-[#173f3a]" aria-label="تصویر بعدی"><ChevronRight /></button>
        <div className="text-center"><p className="font-bold">{gallery[index].caption}</p><p className="mt-1 text-sm text-white/55">{index + 1} از {gallery.length}</p></div>
        <button onClick={() => onNavigate((index - 1 + gallery.length) % gallery.length)} className="rounded-full border border-white/25 p-3 transition hover:bg-white hover:text-[#173f3a]" aria-label="تصویر قبلی"><ChevronLeft /></button>
      </div>
    </motion.div>
  );
}

function DoctorCard({ doctor, index, onNavigate }: { doctor: Doctor; index: number; onNavigate: (path: string) => void }) {
  const doctorPath = `/doctors/${doctor.slug}`;
  const handleDoctorLink = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }
    event.preventDefault();
    onNavigate(doctorPath);
  };

  return (
    <motion.article initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ delay: (index % 2) * .1 }} className="group flex flex-col">
      <a href={withBase(doctorPath)} onClick={handleDoctorLink} className="relative block aspect-[4/3] overflow-hidden rounded-t-[10rem] bg-cover bg-center shadow-lg shadow-[#173f3a]/10" style={{ backgroundImage: `url(${doctor.img})` }} aria-label={`مشاهده صفحه معرفی ${doctor.name}`}>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0d302d]/90 via-[#0d302d]/25 to-transparent p-5 pt-24">
          <span className="rounded-full bg-[#edaa7f] px-3.5 py-1.5 text-xs font-bold text-[#173f3a]">{doctor.exp}</span>
        </div>
      </a>
      <div className="flex flex-1 flex-col rounded-b-[2rem] border border-t-0 border-[#173f3a]/12 bg-white/70 p-7 md:p-8">
        <h3 className="text-2xl font-extrabold">{doctor.name}</h3>
        <p className="mt-1.5 font-medium text-[#c56f50]">{doctor.role}</p>
        <ul className="mt-6 flex-1 space-y-3.5">
          {doctor.bio.map((line, i) => <li key={i} className="flex gap-3 text-[.95rem] leading-8 text-[#5f6f6a]"><span className="mt-3.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#edaa7f]" /><span>{line}</span></li>)}
        </ul>
        <a href={withBase(doctorPath)} onClick={handleDoctorLink} className="mt-7 inline-flex w-fit items-center gap-2.5 rounded-full border border-[#173f3a]/20 px-5 py-2.5 text-sm font-bold transition hover:border-[#173f3a] hover:bg-[#173f3a] hover:text-white">مشاهده پروفایل <ArrowLeft size={16} className="transition group-hover:-translate-x-1" /></a>
      </div>
    </motion.article>
  );
}

function ReviewsSection() {
  const [activeReview, setActiveReview] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { amount: .35 });
  const reducedMotion = useReducedMotion();
  const isAutoRotating = isInView && !isPaused && !isHovered && !hasFocus && !reducedMotion;

  useEffect(() => {
    if (!isAutoRotating) return;
    const timer = window.setInterval(() => {
      setActiveReview((current) => (current + 1) % reviews.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, [isAutoRotating]);

  const selectReview = (index: number) => {
    setActiveReview((index + reviews.length) % reviews.length);
    setIsPaused(true);
  };

  return (
    <section
      id="experience"
      ref={sectionRef}
      aria-labelledby="reviews-heading"
      aria-roledescription="اسلایدر دیدگاه‌ها"
      className="mx-auto max-w-[1300px] px-5 py-24 md:px-10 md:py-36"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={() => setHasFocus(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setHasFocus(false);
      }}
    >
      <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-24">
        <div className="experience-image h-[520px] overflow-hidden rounded-t-[10rem]" role="img" aria-label="گفت‌وگوی دندانپزشک با مراجعه‌کننده در کلینیک" />
        <div className="min-w-0">
          <p className="eyebrow">تجربه مراجعین</p>
          <h2 id="reviews-heading" className="section-title mt-4">آرامش از لحظه ورود</h2>
          {/* Stacked slides reserve the tallest review's space so the image never shifts. */}
          <div id="reviews-slides" className="mt-9 grid" aria-live={isAutoRotating ? "off" : "polite"} aria-atomic="true">
            {reviews.map((review, index) => (
              <motion.figure
                key={review.id}
                className="col-start-1 row-start-1 min-w-0"
                initial={false}
                animate={{ opacity: index === activeReview ? 1 : 0, y: reducedMotion || index === activeReview ? 0 : 8 }}
                transition={{ duration: reducedMotion ? 0 : .3, ease: "easeInOut" }}
                aria-hidden={index !== activeReview}
                style={{ pointerEvents: index === activeReview ? "auto" : "none" }}
              >
                <blockquote className="border-r-2 border-[#edaa7f] pr-7 text-xl font-medium leading-10 text-[#4e625d] md:text-2xl">«{review.quote}»</blockquote>
                <figcaption className="mt-6 flex flex-wrap gap-x-2 gap-y-1 leading-7">
                  <span className="font-bold">{review.name}</span>
                  <span className="text-[#82908c]">{review.treatment}</span>
                </figcaption>
              </motion.figure>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => selectReview(activeReview - 1)} aria-label="دیدگاه قبلی" aria-controls="reviews-slides" className="grid h-11 w-11 place-items-center rounded-full border border-[#173f3a]/20 transition hover:bg-[#173f3a] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c56f50]">
              <ChevronRight size={19} aria-hidden="true" />
            </button>
            <div className="flex items-center" role="group" aria-label="انتخاب دیدگاه">
              {reviews.map((review, index) => (
                <button type="button" key={review.id} onClick={() => selectReview(index)} aria-label={`نمایش دیدگاه ${review.name}`} aria-pressed={index === activeReview} aria-controls="reviews-slides" className="group flex h-11 items-center justify-center rounded-full px-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c56f50]">
                  <span className={`block h-1.5 rounded-full transition-all motion-reduce:transition-none ${index === activeReview ? "w-9 bg-[#173f3a]" : "w-4 bg-[#173f3a]/20 group-hover:bg-[#173f3a]/50"}`} />
                </button>
              ))}
            </div>
            <button type="button" onClick={() => selectReview(activeReview + 1)} aria-label="دیدگاه بعدی" aria-controls="reviews-slides" className="grid h-11 w-11 place-items-center rounded-full border border-[#173f3a]/20 transition hover:bg-[#173f3a] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c56f50]">
              <ChevronLeft size={19} aria-hidden="true" />
            </button>
            {!reducedMotion && (
              <button type="button" onClick={() => setIsPaused((paused) => !paused)} aria-label={isPaused ? "پخش خودکار دیدگاه‌ها" : "توقف پخش خودکار دیدگاه‌ها"} aria-controls="reviews-slides" className="grid h-11 w-11 place-items-center rounded-full text-[#687873] transition hover:bg-[#173f3a]/5 hover:text-[#173f3a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c56f50]">
                {isPaused ? <Play size={17} aria-hidden="true" /> : <Pause size={17} aria-hidden="true" />}
              </button>
            )}
          </div>
          <p className="mt-3 text-xs leading-6 text-[#82908c]">دیدگاه‌های نمونه؛ قابل جایگزینی با نظرات واقعی مراجعین.</p>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const [route, setRoute] = useState(() => getRoutePath());
  const [menu, setMenu] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const scrollTo = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMenu(false); };

  useEffect(() => {
    const onPopState = () => setRoute(getRoutePath());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const doctorSlug = getDoctorSlugFromRoute(route);
  const activeDoctor = doctorSlug ? getDoctorBySlug(doctorSlug) : undefined;

  useEffect(() => {
    if (!doctorSlug) {
      document.title = HOME_TITLE;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute("content", HOME_DESCRIPTION);
    }
  }, [doctorSlug]);

  const navigateTo = (target: string) => {
    const [rawPath, hash] = target.split("#");
    const cleanPath = rawPath || "/";
    const fullUrl = `${withBase(cleanPath)}${hash ? `#${hash}` : ""}`;
    window.history.pushState({}, "", fullUrl);
    setRoute(getRoutePath(withBase(cleanPath)));
    setMenu(false);
    setLightbox(null);

    if (hash) {
      window.setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
      }, 60);
    } else {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  };

  if (activeDoctor) {
    return <DoctorProfilePage doctor={activeDoctor} onNavigate={navigateTo} />;
  }

  if (doctorSlug) {
    return (
      <main dir="rtl" className="grid min-h-screen place-items-center bg-[#faf8f2] px-5 text-center text-[#173f3a]">
        <div className="max-w-md">
          <p className="eyebrow">خطای ۴۰۴</p>
          <h1 className="mt-3 text-3xl font-black">پزشک مورد نظر پیدا نشد</h1>
          <p className="mt-4 leading-8 text-[#687873]">صفحه معرفی مورد نظر در دسترس نیست. می‌توانید لیست کامل پزشکان کلینیک را در صفحه اصلی مشاهده کنید.</p>
          <button type="button" onClick={() => navigateTo("/#doctors")} className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#173f3a] px-7 py-4 font-bold text-white transition hover:bg-[#c56f50]">
            بازگشت به لیست پزشکان <ArrowLeft size={18} aria-hidden="true" />
          </button>
        </div>
      </main>
    );
  }

  return <main dir="rtl" className="overflow-hidden bg-[#faf8f2] text-[#173f3a]">
    <section className="hero relative min-h-[760px] text-white md:min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-l from-[#0c3532]/95 via-[#0c3532]/60 to-[#0c3532]/10" />
      <header className="relative z-20 mx-auto flex max-w-[1400px] items-center justify-between px-5 py-6 md:px-10 lg:px-16">
        <button onClick={() => scrollTo("home")} className="flex items-center gap-3 text-right"><ToothMark /><span className="leading-tight"><b className="block text-xl">نن‌دخدون</b><small className="text-white/65">مرکز تخصصی دندانپزشکی</small></span></button>
        <nav className="hidden items-center gap-7 text-sm font-semibold lg:flex xl:gap-9"><button onClick={() => scrollTo("services")}>خدمات</button><button onClick={() => scrollTo("doctors")}>پزشکان ما</button><button onClick={() => scrollTo("psychologist")}>روانشناس</button><button onClick={() => scrollTo("about")}>درباره ما</button><button onClick={() => scrollTo("gallery")}>گالری</button><button onClick={() => scrollTo("experience")}>تجربه مراجعین</button><button onClick={() => scrollTo("contact")}>تماس با ما</button></nav>
        <button onClick={() => scrollTo("appointments")} className="hidden rounded-full border border-white/40 px-6 py-3 text-sm font-bold transition hover:bg-white hover:text-[#173f3a] sm:block">دریافت نوبت</button>
        <button onClick={() => setMenu(!menu)} className="rounded-full border border-white/30 p-3 lg:hidden" aria-label="منو">{menu ? <X /> : <Menu />}</button>
      </header>
      <AnimatePresence>{menu && <motion.nav initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="absolute left-5 right-5 top-24 z-30 flex flex-col gap-5 rounded-3xl bg-[#faf8f2] p-7 font-bold text-[#173f3a] shadow-2xl lg:hidden"><button onClick={() => scrollTo("services")}>خدمات</button><button onClick={() => scrollTo("doctors")}>پزشکان ما</button><button onClick={() => scrollTo("psychologist")}>روانشناس</button><button onClick={() => scrollTo("about")}>درباره ما</button><button onClick={() => scrollTo("gallery")}>گالری</button><button onClick={() => scrollTo("experience")}>تجربه مراجعین</button><button onClick={() => scrollTo("contact")}>تماس با ما</button></motion.nav>}</AnimatePresence>
      <div id="home" className="relative z-10 mx-auto flex min-h-[630px] max-w-[1400px] items-end px-5 pb-20 md:min-h-[calc(100vh-100px)] md:items-center md:px-10 md:pb-12 lg:px-16"><motion.div initial={{ opacity: 0, y: 35 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8 }} className="max-w-3xl"><div className="mb-5 flex items-center gap-3 text-sm text-white/75"><span className="h-px w-9 bg-[#edaa7f]" /> اینجا لبخندها ماندگار می‌شوند</div><h1 className="font-black leading-[.94] tracking-[-.055em]"><span className="block text-[clamp(4.7rem,12vw,10rem)] text-[#edaa7f]">نن‌دخدون</span><span className="mt-4 block text-[clamp(2rem,4.2vw,4.5rem)]">بله، درست خوندی 😁</span></h1><p className="mt-7 max-w-xl text-base leading-8 text-white/78 md:text-lg">درمان دقیق، تکنولوژی روز و همراهی صمیمانه؛ برای اینکه تجربه دندانپزشکی شما آرام، روشن و مطمئن باشد.</p><div className="mt-9 flex flex-wrap gap-3"><button onClick={() => scrollTo("appointments")} className="group flex items-center gap-5 rounded-full bg-[#edaa7f] px-7 py-4 font-bold text-[#173f3a] transition hover:bg-white">رزرو نوبت آنلاین <ArrowLeft size={19} className="transition group-hover:-translate-x-1" /></button><a href="tel:02100000000" className="flex items-center gap-3 rounded-full border border-white/35 px-7 py-4 font-bold transition hover:bg-white/10"><Phone size={18} /> تماس با کلینیک</a></div></motion.div></div>
      <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2.2 }} className="absolute bottom-7 left-8 z-10 hidden text-xs text-white/60 md:flex md:items-center md:gap-3"><span className="h-12 w-px bg-white/35" /> برای کشف بیشتر اسکرول کنید</motion.div>
    </section>

    <section id="appointments" className="scroll-mt-8 bg-[#173f3a] text-white">
      <div className="mx-auto grid max-w-[1300px] gap-10 px-5 py-16 md:px-10 md:py-20 lg:grid-cols-[.8fr_1.2fr] lg:items-center lg:gap-20">
        <div>
          <p className="eyebrow !text-[#edaa7f]">رزرو نوبت</p>
          <h2 className="mt-3 text-3xl font-black leading-[1.4] md:text-4xl">برای همه لبخندها، کنار شما هستیم</h2>
          <p className="mt-4 max-w-md leading-8 text-white/65">برای دریافت نوبت و هماهنگی، با شماره ویژه بزرگسالان یا کودکان تماس بگیرید.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <a href="tel:+989013770151" className="group flex min-h-36 items-center justify-between gap-4 border border-white/20 px-6 py-6 transition hover:border-[#edaa7f] hover:bg-white/5" aria-label="تماس برای رزرو نوبت دندانپزشکی بزرگسالان">
            <span>
              <span className="block text-sm text-white/60">رزرو نوبت</span>
              <span className="mt-1 block text-lg font-bold">دندانپزشکی بزرگسالان</span>
              <span dir="ltr" className="mt-3 block text-xl font-semibold tracking-wide text-[#edaa7f]">۰۹۰۱ ۳۷۷ ۰۱۵۱</span>
            </span>
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#edaa7f] text-[#173f3a] transition group-hover:scale-105"><Phone size={19} /></span>
          </a>
          <a href="tel:+989901303881" className="group flex min-h-36 items-center justify-between gap-4 border border-white/20 px-6 py-6 transition hover:border-[#edaa7f] hover:bg-white/5" aria-label="تماس برای رزرو نوبت دندانپزشکی کودکان">
            <span>
              <span className="block text-sm text-white/60">رزرو نوبت</span>
              <span className="mt-1 block text-lg font-bold">دندانپزشکی کودکان</span>
              <span dir="ltr" className="mt-3 block text-xl font-semibold tracking-wide text-[#edaa7f]">۰۹۹۰ ۱۳۰ ۳۸۸۱</span>
            </span>
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#edaa7f] text-[#173f3a] transition group-hover:scale-105"><Phone size={19} /></span>
          </a>
        </div>
      </div>
    </section>

    <section id="services" className="mx-auto max-w-[1300px] px-5 py-24 md:px-10 md:py-36"><div className="grid gap-14 lg:grid-cols-[.7fr_1.3fr] lg:gap-24"><div className="lg:sticky lg:top-24 lg:self-start"><p className="eyebrow">خدمات نن‌دخدون</p><h2 className="section-title mt-4">همه‌چیز برای یک لبخند سالم</h2><p className="mt-6 max-w-sm leading-8 text-[#687873]">از پیشگیری تا درمان‌های تخصصی و زیبایی، هر مسیر درمان با یک معاینه دقیق و توضیح شفاف آغاز می‌شود.</p></div><div className="border-t border-[#173f3a]/20">{services.map((service, i) => <motion.div key={service.number} initial={{ opacity: 0, x: 25 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-70px" }} transition={{ delay: i * .05 }} className="group grid gap-3 border-b border-[#173f3a]/20 py-7 sm:grid-cols-[60px_1fr_1.25fr] sm:items-center"><span className="font-bold text-[#c56f50]">{service.number}</span><h3 className="text-xl font-extrabold transition group-hover:text-[#c56f50] md:text-2xl">{service.title}</h3><p className="leading-7 text-[#687873]">{service.text}</p></motion.div>)}</div></div></section>

    <section id="doctors" className="mx-auto max-w-[1150px] px-5 py-24 md:px-10 md:py-36">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div><p className="eyebrow">تیم ما</p><h2 className="section-title mt-4">پزشکان ما</h2></div>
        <p className="max-w-md leading-8 text-[#687873]">تیمی از دندانپزشکان متخصص و باتجربه؛ هر کدام در حوزه خود بهترین هستند و همراه شما از اولین معاینه تا آخرین لبخند.</p>
      </div>
      <div className="mt-16 grid gap-x-10 gap-y-14 sm:grid-cols-2">{doctors.map((doctor, i) => <DoctorCard key={doctor.slug} doctor={doctor} index={i} onNavigate={navigateTo} />)}</div>
    </section>

    <PsychologistSection onBook={() => scrollTo("appointments")} />

    <section id="about" className="bg-[#173f3a] text-white"><div className="grid min-h-[720px] lg:grid-cols-2"><motion.div initial={{ opacity: 0, scale: 1.04 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: .9 }} className="about-image min-h-[480px] lg:min-h-full" /><div className="flex items-center px-6 py-20 md:px-16 lg:px-[10%]"><div className="max-w-xl"><p className="eyebrow !text-[#edaa7f]">داستان ما</p><h2 className="section-title mt-4 text-white">اینجا، اول از همه شنیده می‌شوید</h2><p className="mt-7 text-lg leading-9 text-white/70">در نن‌دخدون باور داریم درمان خوب فقط مهارت پزشکی نیست. آگاهی، آرامش و اعتماد شما بخش مهمی از نتیجه است. برای همین پیش از هر اقدامی، با دقت می‌شنویم، شفاف توضیح می‌دهیم و بهترین مسیر را همراه شما انتخاب می‌کنیم.</p><div className="mt-10 space-y-5 border-t border-white/15 pt-8"><div className="flex items-center gap-4"><ShieldCheck className="text-[#edaa7f]" /><span>استانداردهای سخت‌گیرانه بهداشت و استریلیزاسیون</span></div><div className="flex items-center gap-4"><Sparkles className="text-[#edaa7f]" /><span>درمان محافظه‌کارانه با نتیجه‌ای طبیعی</span></div><div className="flex items-center gap-4"><Clock3 className="text-[#edaa7f]" /><span>احترام به زمان و برنامه‌ریزی دقیق درمان</span></div></div></div></div></div></section>

    <section className="bg-[#edaa7f] px-5 py-24 text-[#173f3a] md:px-10 md:py-32"><motion.div initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mx-auto max-w-5xl text-center"><span className="text-6xl font-black opacity-30">“</span><h2 className="mx-auto -mt-3 max-w-4xl text-3xl font-black leading-[1.6] md:text-5xl">هدف ما فقط درمان دندان نیست؛ می‌خواهیم ترس از دندانپزشکی را برای همیشه از خاطرتان پاک کنیم.</h2><button onClick={() => scrollTo("appointments")} className="mt-10 inline-flex items-center gap-4 rounded-full bg-[#173f3a] px-7 py-4 font-bold text-white transition hover:bg-white hover:text-[#173f3a]">شروع یک تجربه متفاوت <ArrowLeft size={19} /></button></motion.div></section>

    <section id="gallery" className="mx-auto max-w-[1300px] px-5 py-24 md:px-10 md:py-36">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div><p className="eyebrow">گالری تصاویر</p><h2 className="section-title mt-4">نن‌دخدون‌گرافی</h2></div>
        <p className="max-w-md leading-8 text-[#687873]">فضایی روشن، آرام و کاملا استریل؛ جایی که تجهیزات به‌روز در خدمت آرامش شما قرار گرفته است.</p>
      </div>
      <div className="mt-16 grid auto-rows-[200px] grid-cols-2 gap-4 sm:auto-rows-[220px] sm:grid-cols-4">
        {gallery.map((item, i) => (
          <motion.button key={item.src} onClick={() => setLightbox(i)} initial={{ opacity: 0, scale: .96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-50px" }} transition={{ delay: (i % 4) * .07 }} className={`group relative overflow-hidden rounded-2xl bg-cover bg-center shadow-sm ${item.span}`} style={{ backgroundImage: `url(${item.src})` }} aria-label={`بزرگ‌نمایی ${item.caption}`}>
            <span className="absolute inset-0 bg-gradient-to-t from-[#0d302d]/85 via-[#0d302d]/10 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
            <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 p-4 text-white opacity-0 transition duration-300 group-hover:opacity-100">
              <span className="text-sm font-bold">{item.caption}</span>
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#edaa7f] text-[#173f3a]"><Maximize2 size={15} /></span>
            </span>
          </motion.button>
        ))}
      </div>
    </section>

    <ReviewsSection />

    <section className="mx-auto max-w-4xl px-5 pb-28 md:px-10 md:pb-36"><div className="text-center"><p className="eyebrow">پرسش‌های متداول</p><h2 className="section-title mt-4">شاید سوال شما هم باشد</h2></div><div className="mt-14 border-t border-[#173f3a]/20">{faqs.map(([q, a]) => <details key={q} className="group border-b border-[#173f3a]/20 py-1"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-6 text-lg font-extrabold md:text-xl">{q}<ChevronDown className="shrink-0 transition group-open:rotate-180" /></summary><p className="max-w-2xl pb-7 leading-8 text-[#687873]">{a}</p></details>)}</div></section>

    <footer id="contact" className="bg-[#0d302d] px-5 pb-8 pt-20 text-white md:px-10 md:pt-28"><div className="mx-auto max-w-[1300px]"><div className="grid gap-14 border-b border-white/15 pb-16 md:grid-cols-[1.1fr_.9fr]"><div><div className="flex items-center gap-3"><ToothMark /><b className="text-3xl">نن‌دخدون</b></div><h2 className="mt-9 max-w-2xl text-4xl font-black leading-[1.5] md:text-6xl">لبخند بعدی، می‌تواند لبخند شما باشد.</h2><button onClick={() => scrollTo("appointments")} className="mt-9 inline-flex items-center gap-5 rounded-full bg-[#edaa7f] px-7 py-4 font-bold text-[#173f3a] transition hover:bg-white">دریافت نوبت <CalendarDays size={20} /></button></div><div className="space-y-7 self-end text-white/75"><a href="tel:+982122577341" className="flex items-center gap-4 transition hover:text-white"><Phone className="text-[#edaa7f]" />۰۲۱-۲۲۵۷۷۳۴۱ موارد غیر رزرو وقت</a><div className="space-y-4"><div className="flex items-start gap-4"><MapPin className="mt-1 shrink-0 text-[#edaa7f]" /> تهران، خیابان کلاهدوز (دولت)، ساختمان پزشکان نرگس</div><div className="flex flex-wrap gap-2.5 pr-10" aria-label="مسیریابی"><a href="https://maps.app.goo.gl/FPdRnaCgJ8hoBtsm9" target="_blank" rel="noopener noreferrer" aria-label="مسیریابی با گوگل مپ" className="group inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-sm font-semibold text-white transition hover:border-[#edaa7f] hover:bg-[#edaa7f] hover:text-[#173f3a]"><Navigation size={15} className="text-[#edaa7f] transition group-hover:text-[#173f3a]" aria-hidden="true" /> گوگل مپس</a><a href="https://nshn.ir/ac_bv7uXGxuI-C" target="_blank" rel="noopener noreferrer" aria-label="مسیریابی با نشان" className="group inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-sm font-semibold text-white transition hover:border-[#edaa7f] hover:bg-[#edaa7f] hover:text-[#173f3a]"><Navigation size={15} className="text-[#edaa7f] transition group-hover:text-[#173f3a]" aria-hidden="true" /> نشان</a><a href="https://balad.ir/p/6go2YO9Hwll6w5" target="_blank" rel="noopener noreferrer" aria-label="مسیریابی با بلد" className="group inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-sm font-semibold text-white transition hover:border-[#edaa7f] hover:bg-[#edaa7f] hover:text-[#173f3a]"><Navigation size={15} className="text-[#edaa7f] transition group-hover:text-[#173f3a]" aria-hidden="true" /> بلد</a></div></div><div className="flex items-center gap-4"><Clock3 className="text-[#edaa7f]" />همه‌روزه ساعت ۱۰ صبح تا ۸ شب با هماهنگی قبلی</div><a href="#" className="flex items-center gap-4 transition hover:text-white"><AtSign className="text-[#edaa7f]" /> nandakhdoon</a></div></div><div className="flex flex-col gap-3 pt-7 text-xs text-white/45 sm:flex-row sm:justify-between"><p>© ۱۴۰۴ کلینیک دندانپزشکی نن‌دخدون</p><p>تمام حقوق محفوظ است.</p></div></div></footer>
    <AnimatePresence>{lightbox !== null && <Lightbox index={lightbox} onClose={() => setLightbox(null)} onNavigate={setLightbox} />}</AnimatePresence>
  </main>;
}