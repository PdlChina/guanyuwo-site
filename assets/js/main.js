/* =========================================================
   路里v路外 · 交互逻辑
   ========================================================= */
(function () {
  "use strict";

  /* ---------- 0. 页脚年份 ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- 1. 移动端菜单 ---------- */
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      links.classList.toggle("open");
    });
    // 点击链接后自动收起
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
      });
    });
  }

  /* ---------- 2. 类型元数据 ---------- */
  var TYPE_META = {
    article: { label: "文章", icon: "📄", grad: "linear-gradient(135deg,#c0585a,#9c4446)" },
    video:   { label: "视频", icon: "🎬", grad: "linear-gradient(135deg,#46508c,#2f3a6b)" },
    image:   { label: "图文", icon: "🖼️", grad: "linear-gradient(135deg,#b06a8f,#6f4a8c)" }
  };

  function coverHTML(work) {
    var meta = TYPE_META[work.type] || TYPE_META.article;
    if (work.cover) {
      return '<div class="work__cover" style="background:center/cover no-repeat url(\'' +
        work.cover + '\')"></div>';
    }
    return '<div class="work__cover" style="background:' + meta.grad + '">' + meta.icon + "</div>";
  }

  function linkHTML(work) {
    if (!work.link) return "";
    return '<a class="work__link" href="' + work.link +
      '" target="_blank" rel="noopener">查看 →</a>';
  }

  /* ---------- 3. 渲染代表作品 ---------- */
  function renderFeatured() {
    var grid = document.getElementById("featuredGrid");
    if (!grid || !window.WORKS) return;
    var picks = window.WORKS.filter(function (w) { return w.featured; }).slice(0, 3);
    grid.innerHTML = picks.map(function (w) {
      var meta = TYPE_META[w.type] || TYPE_META.article;
      var cover = w.cover
        ? '<div class="feat-card__cover" style="background:center/cover no-repeat url(\'' + w.cover + '\')"></div>'
        : '<div class="feat-card__cover" style="background:' + meta.grad + '">' + meta.icon + "</div>";
      return '' +
        '<article class="feat-card">' +
          cover +
          '<div class="feat-card__body">' +
            '<span class="feat-card__tag">' + meta.label + (w.platform ? " · " + w.platform : "") + '</span>' +
            '<h3 class="feat-card__title">' + w.title + '</h3>' +
            '<p class="feat-card__desc">' + w.desc + '</p>' +
          '</div>' +
        '</article>';
    }).join("");
  }

  /* ---------- 4. 渲染作品列表 + 筛选 ---------- */
  var currentFilter = "all";

  function renderWorks() {
    var grid = document.getElementById("worksGrid");
    if (!grid || !window.WORKS) return;
    var list = window.WORKS.filter(function (w) {
      return currentFilter === "all" || w.type === currentFilter;
    });
    if (!list.length) {
      grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--ink-soft)">这个分类下还没有作品，去数据文件加一条吧~</p>';
      return;
    }
    grid.innerHTML = list.map(function (w) {
      var meta = TYPE_META[w.type] || TYPE_META.article;
      return '' +
        '<article class="work">' +
          coverHTML(w) +
          '<div class="work__body">' +
            '<div class="work__meta">' +
              '<span class="work__type">' + meta.label + '</span>' +
              '<span>' + (w.date || "") + '</span>' +
            '</div>' +
            '<h3 class="work__title">' + w.title + '</h3>' +
            '<p class="work__desc">' + w.desc + '</p>' +
            '<div class="work__foot">' +
              '<span class="work__plat">' + (w.platform || "") + '</span>' +
              linkHTML(w) +
            '</div>' +
          '</div>' +
        '</article>';
    }).join("");
  }

  function bindTabs() {
    var tabs = document.getElementById("tabs");
    if (!tabs) return;
    tabs.querySelectorAll(".tab").forEach(function (btn) {
      btn.addEventListener("click", function () {
        tabs.querySelectorAll(".tab").forEach(function (b) { b.classList.remove("is-active"); });
        btn.classList.add("is-active");
        currentFilter = btn.getAttribute("data-filter");
        renderWorks();
      });
    });
  }

  /* ---------- 5. 滚动揭示动画（观察器；无 JS / 异常时由 CSS 与头部脚本兜底） ---------- */
  function bindReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 6. 表单提交 ----------
     默认走 Formspree（免费表单服务）。
     用法：把下面 FORM_ENDPOINT 换成你在 formspree.io 拿到的地址，
     例如 "https://formspree.io/f/abcdwxyz"。
     没配置时，自动降级为用邮件客户端发送，照样能用。 */
  var FORM_ENDPOINT = ""; // ← 在这里粘贴你的 Formspree 地址

  function bindForm() {
    var form = document.getElementById("contactForm");
    var hint = document.getElementById("formHint");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = {
        name: form.name.value.trim(),
        contact: form.contact.value.trim(),
        type: form.type.value,
        message: form.message.value.trim()
      };

      if (!data.name || !data.contact || !data.message) {
        hint.className = "form__hint err";
        hint.textContent = "请把带 * 的必填项填完整~";
        return;
      }

      // 没配置 Formspree：降级为邮件
      if (!FORM_ENDPOINT) {
        var subject = encodeURIComponent("【" + data.type + "】来自 " + data.name);
        var body = encodeURIComponent(
          "称呼：" + data.name + "\n联系方式：" + data.contact +
          "\n类型：" + data.type + "\n\n内容：\n" + data.message
        );
        window.location.href = "mailto:hi@guanyuwo.cn?subject=" + subject + "&body=" + body;
        hint.className = "form__hint ok";
        hint.textContent = "已为你打开邮件客户端，发送即可（配置 Formspree 后可免邮件直接提交）。";
        return;
      }

      // 配置了 Formspree：直接提交
      hint.className = "form__hint";
      hint.textContent = "提交中…";
      fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: JSON.stringify(data)
      }).then(function (res) {
        if (res.ok) {
          form.reset();
          hint.className = "form__hint ok";
          hint.textContent = "收到啦！我会尽快回复你 ✅";
        } else {
          throw new Error("submit failed");
        }
      }).catch(function () {
        hint.className = "form__hint err";
        hint.textContent = "提交失败，请稍后再试，或直接邮件联系 hi@guanyuwo.cn";
      });
    });
  }

  /* ---------- 启动 ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    renderFeatured();
    renderWorks();
    bindTabs();
    bindReveal();
    bindForm();
  });
})();
