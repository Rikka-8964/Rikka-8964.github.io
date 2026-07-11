/* ============================================================
   个人网站 - 交互脚本
   导航 | 滚动动画 | 移动端菜单 | 打字效果 | 回到顶部
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ----- 元素引用 -----
  const navbar = document.getElementById('navbar');
  const navLinks = document.getElementById('nav-links');
  const hamburger = document.getElementById('hamburger');
  const navLinkItems = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const backToTop = document.getElementById('back-to-top');

  // ----- 打字机效果 -----
  const typewriter = document.getElementById('typewriter');
  const roles = ['硬件控', '游戏玩家', '折腾爱好者', 'INFP 调停者'];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 120;

  function typeLoop() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      charIndex--;
      typewriter.textContent = currentRole.substring(0, charIndex);
      typeSpeed = 50;
    } else {
      charIndex++;
      typewriter.textContent = currentRole.substring(0, charIndex);
      typeSpeed = 120;
    }

    // 单词打完，停顿后开始删除
    if (!isDeleting && charIndex === currentRole.length) {
      typeSpeed = 2000;
      isDeleting = true;
    }
    // 删除完毕，切换到下一个词
    else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typeSpeed = 300;
    }

    setTimeout(typeLoop, typeSpeed);
  }

  if (typewriter) {
    setTimeout(typeLoop, 1000);
  }

  // ----- 导航栏滚动效果 -----
  function updateNavbar() {
    const scrollY = window.scrollY;
    navbar.classList.toggle('scrolled', scrollY > 50);

    // 回到顶部按钮
    backToTop.classList.toggle('visible', scrollY > 500);
  }

  // ----- Scrollspy: 当前可视区块高亮对应导航 -----
  function updateActiveNav() {
    let currentSection = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinkItems.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentSection}`);
    });
  }

  window.addEventListener('scroll', () => {
    updateNavbar();
    updateActiveNav();
  }, { passive: true });

  // ----- 平滑滚动导航 -----
  navLinkItems.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        closeMobileMenu();
      }
    });
  });

  // ----- 移动端菜单 -----
  function openMobileMenu() {
    navLinks.classList.add('open');
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function toggleMobileMenu() {
    if (navLinks.classList.contains('open')) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  hamburger.addEventListener('click', toggleMobileMenu);

  // 点击菜单外关闭
  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('open') &&
        !navLinks.contains(e.target) &&
        !hamburger.contains(e.target)) {
      closeMobileMenu();
    }
  });

  // ESC 关闭菜单
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      closeMobileMenu();
    }
  });

  // ----- 回到顶部 -----
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ----- Intersection Observer: 滚动动画 -----
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  };

  const elementsToReveal = document.querySelectorAll(
    '.reveal, .about-avatar-wrapper, .about-text, .skill-category, .timeline-item, .project-card, .game-card, .contact-link'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  elementsToReveal.forEach(el => observer.observe(el));

  // ----- 技能条动画 (独立 observer: 更高的触发阈值) -----
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fills = entry.target.querySelectorAll('.skill-fill');
        fills.forEach((fill, i) => {
          setTimeout(() => fill.classList.add('animate'), i * 100);
        });
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.skill-category').forEach(cat => {
    skillObserver.observe(cat);
  });

  // ----- 初始状态检查 (页面可能以非顶部位置加载) -----
  updateNavbar();
  updateActiveNav();

});
