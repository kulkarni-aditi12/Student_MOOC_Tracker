import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'wouter';
import { GraduationCap, Sparkles, BookOpen, Users, Star, TrendingUp, Shield, Zap, Award, ChevronRight, Play, Check, Camera } from 'lucide-react';
import { sampleCourses } from '../data/courses';

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function Reveal({
  children,
  delay = 0,
  direction = 'up',
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'left' | 'right' | 'none';
  className?: string;
}) {
  const { ref, visible } = useInView();
  const translate = direction === 'up' ? 'translateY(40px)'
    : direction === 'left' ? 'translateX(-40px)'
    : direction === 'right' ? 'translateX(40px)'
    : 'none';
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : translate,
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ─── Data ─── */
const features = [
  { icon: BookOpen, title: 'Track Progress', desc: 'Monitor your learning journey with beautiful progress indicators and milestone tracking.' },
  { icon: Zap, title: 'Smart Learning', desc: 'Get personalized recommendations based on your interests and learning patterns.' },
  { icon: Shield, title: 'Verified Courses', desc: 'All courses are reviewed and verified by industry experts for quality assurance.' },
  { icon: Award, title: 'Earn Badges', desc: 'Collect achievement badges as you complete courses and reach learning milestones.' },
];

const categories = [
  { name: 'Web Development', count: 120, gradient: 'from-blue-500 to-cyan-500', icon: '🌐' },
  { name: 'Data Science', count: 85, gradient: 'from-green-500 to-teal-500', icon: '📊' },
  { name: 'AI/ML', count: 64, gradient: 'from-purple-500 to-violet-500', icon: '🤖' },
  { name: 'Cloud Computing', count: 48, gradient: 'from-orange-500 to-amber-500', icon: '☁️' },
  { name: 'UI/UX Design', count: 72, gradient: 'from-pink-500 to-rose-500', icon: '🎨' },
  { name: 'Cybersecurity', count: 39, gradient: 'from-red-500 to-orange-500', icon: '🔒' },
];

const testimonials = [
  { name: 'Maria Santos', role: 'Frontend Developer', text: 'MOOC Tracker helped me land my dream job at a tech startup. The progress tracking kept me accountable and motivated every single day.', rating: 5 },
  { name: 'James Kim', role: 'Data Scientist', text: 'I completed 8 data science courses in 3 months. The dashboard made it so easy to see my progress and stay on track. Absolutely love it!', rating: 5 },
  { name: 'Priya Patel', role: 'UX Designer', text: 'As someone juggling a full-time job and learning design, this platform was a game changer. Organized, beautiful, and genuinely helpful.', rating: 5 },
];

/* Curated Unsplash-compatible photo grid for students learning */
const studentPhotos = [
  {
    src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
    label: 'Collaborative Learning',
    size: 'tall',
  },
  {
    src: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800&q=80',
    label: 'Focused Study',
    size: 'normal',
  },
  {
    src: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
    label: 'Hands-on Practice',
    size: 'normal',
  },
  {
    src: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800&q=80',
    label: 'Online Classes',
    size: 'wide',
  },
  {
    src: 'https://images.unsplash.com/photo-1543269664-56d93c1b41a6?w=800&q=80',
    label: 'Group Projects',
    size: 'normal',
  },
  {
    src: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80',
    label: 'Deep Focus',
    size: 'normal',
  },
];

const stats = [
  { value: '50K+', label: 'Students' },
  { value: '500+', label: 'Courses' },
  { value: '95%', label: 'Completion Rate' },
  { value: '4.8★', label: 'Avg Rating' },
];

/* ─── Component ─── */
export default function Landing() {
  const featuredCourses = sampleCourses.slice(0, 6);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <GraduationCap className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-bold text-foreground">MOOC Tracker</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            {['features', 'courses', 'categories', 'testimonials'].map(id => (
              <a key={id} href={`#${id}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors capitalize">
                {id === 'testimonials' ? 'Reviews' : id.charAt(0).toUpperCase() + id.slice(1)}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <button data-testid="button-nav-login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-4 py-2">Sign In</button>
            </Link>
            <Link href="/signup">
              <button data-testid="button-nav-signup" className="text-sm font-semibold bg-gradient-to-r from-primary to-accent text-white px-4 py-2 rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all hover:-translate-y-0.5">Get Started</button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero (no Reveal — immediate on load) ── */}
      <section className="relative pt-24 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute top-40 right-1/4 w-80 h-80 bg-accent/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
          <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s' }} />
        </div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div
            className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-sm text-primary mb-8"
            style={{ animation: 'fadeSlideUp 0.6s ease both' }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>The smarter way to learn online</span>
          </div>
          <h1
            className="text-5xl md:text-7xl font-extrabold leading-tight mb-6"
            style={{ animation: 'fadeSlideUp 0.7s ease 0.1s both' }}
          >
            <span className="text-foreground">Track, Learn, and</span>
            <br />
            <span className="gradient-text">Grow Smarter</span>
          </h1>
          <p
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ animation: 'fadeSlideUp 0.7s ease 0.2s both' }}
          >
            Your personal MOOC dashboard to discover top courses, track your progress, stay motivated, and achieve your learning goals — all in one beautiful place.
          </p>
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            style={{ animation: 'fadeSlideUp 0.7s ease 0.3s both' }}
          >
            <Link href="/signup">
              <button data-testid="button-hero-signup" className="flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-white font-semibold px-8 py-4 rounded-2xl hover:shadow-2xl hover:shadow-primary/30 transition-all hover:-translate-y-1 text-base">
                <Sparkles className="w-4.5 h-4.5" /> Start Learning Free
              </button>
            </Link>
            <Link href="/courses">
              <button data-testid="button-hero-explore" className="flex items-center gap-2 bg-card border border-border text-foreground font-semibold px-8 py-4 rounded-2xl hover:border-primary/40 transition-all text-base">
                <Play className="w-4.5 h-4.5" /> Explore Courses
              </button>
            </Link>
          </div>
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
            style={{ animation: 'fadeSlideUp 0.7s ease 0.4s both' }}
          >
            {stats.map(stat => (
              <div key={stat.label} className="glass rounded-2xl p-4 text-center">
                <div className="text-2xl font-extrabold gradient-text">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Student Photos ── */}
      <section id="students" className="py-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-sm text-primary mb-4">
              <Camera className="w-3.5 h-3.5" /> Student Life
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">Students Learning Every Day</h2>
            <p className="text-muted-foreground">Join a global community of passionate learners</p>
          </Reveal>

          {/* Mosaic grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[200px]">
            {studentPhotos.map((photo, i) => (
              <Reveal
                key={photo.label}
                delay={i * 80}
                direction={i % 2 === 0 ? 'left' : 'right'}
                className={`relative group overflow-hidden rounded-2xl ${photo.size === 'tall' ? 'row-span-2' : photo.size === 'wide' ? 'col-span-2' : ''}`}
              >
                <img
                  src={photo.src}
                  alt={photo.label}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://picsum.photos/seed/student${i}/800/600`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <span className="text-sm font-semibold text-white">{photo.label}</span>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Floating accent badges */}
          <div className="flex flex-wrap justify-center gap-3 mt-10">
            {['🌍 Global Community', '📚 Expert Instructors', '🏆 Achievement Badges', '⚡ Live Sessions', '🤝 Peer Learning', '🎯 Goal Tracking'].map((badge, i) => (
              <Reveal key={badge} delay={i * 60} direction="none">
                <span className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-full bg-card border border-card-border text-foreground hover:border-primary/30 hover:shadow-md transition-all cursor-default">
                  {badge}
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section id="categories" className="py-20 px-6 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-secondary/10 border border-secondary/20 rounded-full px-4 py-1.5 text-sm text-secondary mb-4">
              <TrendingUp className="w-3.5 h-3.5" /> Top Categories
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">Explore by Category</h2>
            <p className="text-muted-foreground">Find courses in your area of interest and passion</p>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, i) => (
              <Reveal key={cat.name} delay={i * 70} direction="up">
                <Link href="/signup">
                  <div className="group bg-card border border-card-border rounded-2xl p-4 text-center cursor-pointer hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300">
                    <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform`}>
                      {cat.icon}
                    </div>
                    <div className="text-sm font-semibold text-foreground mb-1">{cat.name}</div>
                    <div className="text-xs text-muted-foreground">{cat.count} courses</div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Popular Courses ── */}
      <section id="courses" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5 text-sm text-accent mb-4">
              <Star className="w-3.5 h-3.5" /> Popular Courses
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">Top-Rated Courses</h2>
            <p className="text-muted-foreground">Handpicked courses loved by thousands of learners</p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.map((course, i) => (
              <Reveal key={course.id} delay={i * 80} direction="up">
                <Link href="/signup">
                  <div className="group bg-card border border-card-border rounded-2xl overflow-hidden cursor-pointer hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 h-full">
                    <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
                      <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute top-3 left-3">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/80 text-white">{course.category}</span>
                      </div>
                      <div className="absolute bottom-3 right-3">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-black/60 text-white">{course.level}</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground mb-1 line-clamp-2 text-sm group-hover:text-primary transition-colors">{course.title}</h3>
                      <p className="text-xs text-muted-foreground mb-3">by {course.instructor}</p>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1 text-yellow-500">
                          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold text-foreground">{course.rating}</span>
                          <span className="text-muted-foreground">({(course.studentsEnrolled / 1000).toFixed(0)}k)</span>
                        </div>
                        <span className="text-muted-foreground">{course.duration}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal delay={200} className="text-center mt-10">
            <Link href="/signup">
              <button className="flex items-center gap-2 mx-auto bg-card border border-border text-foreground font-semibold px-8 py-3.5 rounded-2xl hover:border-primary/40 transition-all">
                View All Courses <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-20 px-6 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">Everything You Need</h2>
            <p className="text-muted-foreground">Powerful features to supercharge your learning journey</p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 90} direction="up">
                <div className="bg-card border border-card-border rounded-2xl p-6 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 h-full">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 flex items-center justify-center mb-4">
                    <f.icon className="w-5.5 h-5.5 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">How It Works</h2>
            <p className="text-muted-foreground mb-12">Get started in three simple steps</p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Create Account', desc: 'Sign up as a student or instructor in under 30 seconds. No credit card required.' },
              { step: '02', title: 'Discover Courses', desc: 'Browse hundreds of courses across 6 categories. Find what inspires you.' },
              { step: '03', title: 'Learn & Grow', desc: 'Track your progress, earn badges, and build skills that advance your career.' },
            ].map((s, i) => (
              <Reveal key={s.step} delay={i * 120} direction="up">
                <div className="text-6xl font-black gradient-text opacity-20 mb-4">{s.step}</div>
                <h3 className="font-bold text-foreground mb-2 text-lg">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className="py-20 px-6 bg-card/30">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <Reveal direction="left">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-sm text-primary mb-4">
              <Users className="w-3.5 h-3.5" /> For Students
            </div>
            <h2 className="text-3xl font-extrabold text-foreground mb-6">Learn at Your Own Pace</h2>
            {['Access 500+ premium courses', 'Track progress with visual dashboards', 'Earn achievement badges', 'Bookmark courses for later', 'Continue learning from any device', 'Get personalized recommendations'].map(item => (
              <div key={item} className="flex items-center gap-3 mb-3">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">{item}</span>
              </div>
            ))}
          </Reveal>
          <Reveal direction="right">
            <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5 text-sm text-accent mb-4">
              <GraduationCap className="w-3.5 h-3.5" /> For Instructors
            </div>
            <h2 className="text-3xl font-extrabold text-foreground mb-6">Share Your Knowledge</h2>
            {['Create and publish courses easily', 'Track student progress in real-time', 'Detailed analytics and insights', 'Manage your course catalog', 'Connect with thousands of learners', 'Build your educator reputation'].map(item => (
              <div key={item} className="flex items-center gap-3 mb-3">
                <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-accent" />
                </div>
                <span className="text-sm text-muted-foreground">{item}</span>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">Loved by Learners</h2>
            <p className="text-muted-foreground">Real stories from real students</p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 100} direction="up">
                <div className="bg-card border border-card-border rounded-2xl p-6 hover:border-primary/30 transition-all hover:-translate-y-1 duration-300 h-full flex flex-col">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5 italic flex-1">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold text-white">
                      {t.name[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-foreground">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.role}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-6 bg-card/30">
        <div className="max-w-3xl mx-auto text-center">
          <Reveal>
            <div className="relative bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 border border-primary/30 rounded-3xl p-12 overflow-hidden">
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
              </div>
              <div className="relative z-10">
                <GraduationCap className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">Ready to Start Learning?</h2>
                <p className="text-muted-foreground mb-8">Join over 50,000 students who are already growing their skills every day.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/signup">
                    <button data-testid="button-cta-signup" className="flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-white font-semibold px-8 py-4 rounded-2xl hover:shadow-2xl hover:shadow-primary/30 transition-all hover:-translate-y-1">
                      <Sparkles className="w-4.5 h-4.5" /> Get Started Free
                    </button>
                  </Link>
                  <Link href="/login">
                    <button className="px-8 py-4 rounded-2xl bg-card border border-border text-foreground font-semibold hover:border-primary/30 transition-all">
                      Sign In
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold">MOOC Tracker</span>
              </div>
              <p className="text-xs text-muted-foreground">Your premium learning companion for the digital age.</p>
            </div>
            {[
              { title: 'Platform', links: ['Features', 'Pricing', 'Security', 'Enterprise'] },
              { title: 'For Students', links: ['Browse Courses', 'My Learning', 'Certificates', 'Community'] },
              { title: 'Company', links: ['About Us', 'Blog', 'Careers', 'Contact'] },
            ].map(col => (
              <div key={col.title}>
                <div className="text-sm font-semibold text-foreground mb-4">{col.title}</div>
                {col.links.map(link => (
                  <div key={link} className="text-xs text-muted-foreground hover:text-foreground cursor-pointer mb-2 transition-colors">{link}</div>
                ))}
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-muted-foreground">© 2025 MOOC Tracker. Built for learners, by learners.</div>
            <div className="flex gap-4 text-xs text-muted-foreground">
              {['Privacy', 'Terms', 'Cookies'].map(item => (
                <span key={item} className="hover:text-foreground cursor-pointer transition-colors">{item}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
