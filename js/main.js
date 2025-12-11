const API_BASE = '/api';
const API_KEY = 'JooooModdssAlicia11112025';

const menuBtn = document.getElementById('menuBtn');
const closeBtn = document.getElementById('closeBtn');
const sideNav = document.getElementById('sideNav');
const navLinks = document.querySelectorAll('.navLink');
const panels = document.querySelectorAll('.panel');
const form = document.getElementById('subForm');
const resultMsg = document.getElementById('resultMsg');

menuBtn.addEventListener('click', () => sideNav.classList.add('show'));
closeBtn.addEventListener('click', () => sideNav.classList.remove('show'));

navLinks.forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const target = e.target.getAttribute('href').slice(1);
        panels.forEach(p => p.classList.remove('active'));
        navLinks.forEach(l => l.classList.remove('active'));
        document.getElementById(target).classList.add('active');
        e.target.classList.add('active');
        sideNav.classList.remove('show');
    });
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    resultMsg.textContent = '';
    const sub = document.getElementById('subName').value.trim();
    const ip = document.getElementById('subIP').value.trim();
    const domain = document.getElementById('subDomain').value;

    if (!sub || !ip || !domain) {
        resultMsg.textContent = 'All fields required';
        return;
    }
    if (!/^[a-zA-Z0-9-]+$/.test(sub)) {
        resultMsg.textContent = 'Invalid subdomain format';
        return;
    }
    if (!isValidIP(ip)) {
        resultMsg.textContent = 'Invalid IP address';
        return;
    }

    try {
        const url = `${API_BASE}/create-subdomain?subdomain=${sub}&ip=${ip}&domain=${domain}&apikey=${API_KEY}`;
        const res = await fetch(url, { method: 'GET' });
        const data = await res.json();
        if (res.ok) {
            resultMsg.textContent = `✓ Created: ${data.data.subdomain}`;
            form.reset();
        } else {
            resultMsg.textContent = `✗ ${data.error || 'Failed'}`;
        }
    } catch (err) {
        resultMsg.textContent = 'Network error';
    }
});

function isValidIP(ip) {
    const p = ip.split('.');
    if (p.length !== 4) return false;
    return p.every(x => { const n = parseInt(x, 10); return !isNaN(n) && n >= 0 && n <= 255; });
}

const tabBtns = document.querySelectorAll('.tabBtn');
const tabContents = document.querySelectorAll('.tabContent');
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const id = btn.dataset.tab;
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('show'));
        btn.classList.add('active');
        document.getElementById(id).classList.add('show');
    });
});

document.querySelectorAll('.copyBtn').forEach(btn => {
    btn.addEventListener('click', () => {
        const text = document.getElementById(btn.dataset.copy).innerText;
        navigator.clipboard.writeText(text).then(() => {
            btn.textContent = 'Copied!';
            setTimeout(() => btn.textContent = 'Copy', 1200);
        });
    });
});