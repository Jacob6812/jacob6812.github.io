const contentDir = 'contents/';
const sectionNames = ['home', 'awards', 'experience', 'publications'];

const localeContent = {
    zh: {
        documentLang: 'zh-CN',
        title: '方杰｜个人主页',
        pageTopTitle: '方杰',
        nav: {
            home: '首页',
            awards: '荣誉',
            experience: '经历',
            publications: '研究 / 项目'
        },
        hero: {
            title: '方杰',
            buttons: {
                primary: '进入档案',
                secondary: '查看研究 / 项目'
            },
            avatarBottom: '中文默认'
        },
        panels: {
            home: { index: '01 // 个人档案', title: '方杰｜数学 × 经济 × 研究分析', tag: '在线' },
            awards: { index: '02 // 荣誉信号', title: '荣誉奖项', tag: '已记录' },
            experience: { index: '03 // 经历时间线', title: '实习经历', tag: '进行中' },
            publications: { index: '04 // 研究 / 项目档案', title: '研究 / 项目', tag: '索引中' }
        },
        footerLabel: '传输结束',
        copyrightText: '&copy; 方杰 2026. All Rights Reserved.',
        githubText: '主页源码',
        licenseText: '开源许可'
    },
    en: {
        documentLang: 'en',
        title: 'Fang Jie | Homepage',
        pageTopTitle: 'Fang Jie',
        nav: {
            home: 'HOME',
            awards: 'AWARDS',
            experience: 'EXPERIENCE',
            publications: 'RESEARCH / PROJECTS'
        },
        hero: {
            title: 'Fang Jie',
            buttons: {
                primary: 'ENTER PROFILE',
                secondary: 'VIEW RESEARCH / PROJECTS'
            },
            avatarBottom: 'EN ACTIVE'
        },
        panels: {
            home: { index: '01 // CORE PROFILE', title: 'Fang Jie | Mathematics × Economics × Research Analysis', tag: 'ONLINE' },
            awards: { index: '02 // SIGNAL BOOST', title: 'Awards & Distinctions', tag: 'RANKED' },
            experience: { index: '03 // TIMELINE LOG', title: 'Internship Experience', tag: 'ACTIVE' },
            publications: { index: '04 // RESEARCH / PROJECT ARCHIVE', title: 'Research / Projects', tag: 'INDEXED' }
        },
        footerLabel: 'END OF TRANSMISSION',
        copyrightText: '&copy; Fang Jie 2026. All Rights Reserved.',
        githubText: 'Source',
        licenseText: 'License'
    }
};

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

function setHtml(id, value) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = value;
}

function updateLanguageButtons(lang) {
    const zhButton = document.getElementById('lang-zh');
    const enButton = document.getElementById('lang-en');

    if (!zhButton || !enButton) return;

    const isZh = lang === 'zh';
    zhButton.classList.toggle('lang-option-active', isZh);
    enButton.classList.toggle('lang-option-active', !isZh);
    zhButton.setAttribute('aria-pressed', String(isZh));
    enButton.setAttribute('aria-pressed', String(!isZh));
}

function applyUiText(lang) {
    const locale = localeContent[lang];
    document.documentElement.lang = locale.documentLang;
    document.title = locale.title;

    setText('page-top-title', locale.pageTopTitle);
    setText('nav-home', locale.nav.home);
    setText('nav-awards', locale.nav.awards);
    setText('nav-experience', locale.nav.experience);
    setText('nav-publications', locale.nav.publications);

    setText('top-section-bg-text', locale.hero.title);
    setText('hero-button-primary-text', locale.hero.buttons.primary);
    setText('hero-button-secondary-text', locale.hero.buttons.secondary);
    setText('avatar-badge-bottom', locale.hero.avatarBottom);

    setText('home-panel-index', locale.panels.home.index);
    setText('home-subtitle', locale.panels.home.title);
    setText('home-panel-tag', locale.panels.home.tag);

    setText('awards-panel-index', locale.panels.awards.index);
    setText('awards-subtitle', locale.panels.awards.title);
    setText('awards-panel-tag', locale.panels.awards.tag);

    setText('experience-panel-index', locale.panels.experience.index);
    setText('experience-subtitle', locale.panels.experience.title);
    setText('experience-panel-tag', locale.panels.experience.tag);

    setText('publications-panel-index', locale.panels.publications.index);
    setText('publications-subtitle', locale.panels.publications.title);
    setText('publications-panel-tag', locale.panels.publications.tag);

    setText('footer-label', locale.footerLabel);
    setHtml('copyright-text', locale.copyrightText);
    setText('github-link', locale.githubText);
    setText('license-link', locale.licenseText);
}

async function renderSection(lang, sectionName) {
    const response = await fetch(`${contentDir}${sectionName}.${lang}.md`);
    const markdown = await response.text();
    const html = marked.parse(markdown);
    document.getElementById(`${sectionName}-md`).innerHTML = html;
}

async function applyLanguage(lang) {
    const resolvedLang = localeContent[lang] ? lang : 'zh';
    updateLanguageButtons(resolvedLang);
    applyUiText(resolvedLang);

    await Promise.all(sectionNames.map((sectionName) => renderSection(resolvedLang, sectionName)));

    if (window.MathJax && typeof MathJax.typesetPromise === 'function') {
        MathJax.typesetPromise();
    } else if (window.MathJax && typeof MathJax.typeset === 'function') {
        MathJax.typeset();
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    }

    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(document.querySelectorAll('#navbarResponsive .nav-link'));
    responsiveNavItems.forEach((responsiveNavItem) => {
        responsiveNavItem.addEventListener('click', () => {
            if (navbarToggler && window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    marked.use({ mangle: false, headerIds: false });

    const zhButton = document.getElementById('lang-zh');
    const enButton = document.getElementById('lang-en');

    if (zhButton) {
        zhButton.addEventListener('click', () => applyLanguage('zh'));
    }

    if (enButton) {
        enButton.addEventListener('click', () => applyLanguage('en'));
    }

    applyLanguage('zh').catch((error) => console.log(error));
});
