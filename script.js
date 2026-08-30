// ===== 粒子背景（模拟晶格） =====
(function() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height, particles = [];
    const COUNT = 160;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    for (let i = 0; i < COUNT; i++) {
        let x = width * 0.2 + Math.random() * width * 0.6;
        let y = height * 0.2 + Math.random() * height * 0.6;
        particles.push({
            x, y,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            radius: 0.8 + Math.random() * 1.8,
            brightness: 0.3 + Math.random() * 0.6
        });
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
        ctx.lineWidth = 0.6;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                if (dx*dx + dy*dy < 20000) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        for (let p of particles) {
            const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3);
            grad.addColorStop(0, `rgba(148, 200, 255, ${p.brightness * 0.6})`);
            grad.addColorStop(1, 'rgba(56, 189, 248, 0)');
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius * 0.8, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(220, 240, 255, ${p.brightness * 0.9})`;
            ctx.fill();
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > width) p.vx *= -0.5;
            if (p.y < 0 || p.y > height) p.vy *= -0.5;
            const cx = width * 0.45, cy = height * 0.5;
            p.vx += (cx - p.x) * 0.00004;
            p.vy += (cy - p.y) * 0.00004;
            const sp = Math.sqrt(p.vx*p.vx + p.vy*p.vy);
            if (sp > 0.6) { p.vx = (p.vx/sp)*0.6; p.vy = (p.vy/sp)*0.6; }
        }
        requestAnimationFrame(draw);
    }
    draw();
})();

// ===== 模态框系统 =====
const modal = document.getElementById('deviceModal');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const modalClose = document.getElementById('modalClose');

const deviceData = {
    gemini360: {
        name: 'ZEISS Gemini 360',
        specs: [
            ['分辨率', '0.6 nm @ 15 kV；1.2 nm @ 1 kV'],
            ['放大倍数', '12x – 2,000,000x'],
            ['加速电压', '0.02 – 30 kV'],
            ['束流', '1 pA – 50 nA'],
            ['探测器', 'In-lens SE, ETD, STEM, EDS'],
            ['样品台', '五轴马达驱动，倾斜 -10°~ +70°']
        ]
    },
    quantax: {
        name: 'Bruker QUANTAX EDS/EBSD',
        specs: [
            ['探测元素', 'Be⁴ – Am⁹⁵'],
            ['能量分辨率', '≤ 123 eV (Mn Kα)'],
            ['空间分辨率', '< 20 nm (SEM模式下)'],
            ['EBSD 分辨率', '高达 0.5° 取向精度'],
            ['采集速度', '> 1000 点/秒 (谱图)']
        ]
    },
    hysitron: {
        name: 'Bruker Hysitron PI 89',
        specs: [
            ['温度范围', '室温 – 1000°C (真空)'],
            ['最大加载力', '500 mN'],
            ['位移分辨率', '0.04 nm'],
            ['频率', '动态力学分析 (DMA) 0.1–300 Hz'],
            ['原位观察', '兼容 SEM 实时成像']
        ]
    }
};

function showDeviceDetail(key) {
    const data = deviceData[key];
    if (!data) return;
    modalTitle.textContent = data.name;
    modalBody.innerHTML = data.specs.map(row => 
        `<div class="detail-row"><span class="label">${row[0]}</span><span class="value">${row[1]}</span></div>`
    ).join('');
    modal.classList.add('active');
}

// 绑定所有 .btn-detail
document.querySelectorAll('.btn-detail').forEach(btn => {
    btn.addEventListener('click', function() {
        showDeviceDetail(this.dataset.device);
    });
});

if (modalClose) {
    modalClose.addEventListener('click', () => modal.classList.remove('active'));
}
if (modal) {
    modal.addEventListener('click', function(e) {
        if (e.target === this) this.classList.remove('active');
    });
}

// ===== Toast 系统 =====
const toast = document.getElementById('toast');
function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
}

// ===== 联系表单提交 =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        if (!name || !email || !message) {
            showToast('⚠️ 请完整填写所有字段');
            return;
        }
        showToast('✅ 消息已发送，我们的工程师将在 24 小时内联系您！');
        this.reset();
    });
}

// ===== 导航高亮（根据当前页面 URL） =====
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
    });
});

console.log('纳微矩阵 · 多页面交互已启动');
