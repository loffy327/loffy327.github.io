// ==========================================
// 1. GLOBAL VARIABLES & DATABASES
// ==========================================
const DB_KEY = "HacAm_ServerDB";
const CODE_KEY = "HacAm_ServerCodes";

let ServerDB = JSON.parse(localStorage.getItem(DB_KEY) || "{}");
let ServerCodes = JSON.parse(localStorage.getItem(CODE_KEY) || "{}");

let currentAccount = null; 
let isAdmin = false;

let diamonds = 0; 
let totalRechargedKC = 0; 
let ownedHeroes = { 'hero_A1': 1 }; 
const MAX_LEVEL = 20;
let currentInvTab = 'normal';
let globalScore = 0;
let globalKills = 0;

const VIP_THRESHOLDS = [0, 1000, 5000, 10000, 20000, 50000, 100000, 200000, 500000, 1000000, 2000000, 5000000, 10000000];

function getVIPLevel(kc) {
    for (let i = 12; i >= 0; i--) { 
        if (kc >= VIP_THRESHOLDS[i]) return i; 
    } 
    return 0; 
}

const RELIC_DATABASE = {
    'relic_s1': { id: 'relic_s1', name: 'Ngọc Lục Bảo', rank: 'S', hpBonus: 0.1, dmgBonus: 0, color: '#ff00ff' },
    'relic_s2': { id: 'relic_s2', name: 'Vuốt Sói', rank: 'S', hpBonus: 0, dmgBonus: 0.1, color: '#ff00ff' },
    'relic_ss1': { id: 'relic_ss1', name: 'Giáp Phản Lực', rank: 'SS', hpBonus: 0.25, dmgBonus: 0, color: '#ff0000' },
    'relic_ss2': { id: 'relic_ss2', name: 'Gươm Diệt Thần', rank: 'SS', hpBonus: 0, dmgBonus: 0.25, color: '#ff0000' },
    'relic_ss3': { id: 'relic_ss3', name: 'Sừng Ác Quỷ', rank: 'SS', hpBonus: 0.15, dmgBonus: 0.15, color: '#ff0000' },
    'relic_ss4': { id: 'relic_ss4', name: 'Máu Rồng', rank: 'SS', hpBonus: 0.3, dmgBonus: 0, color: '#ff0000' },
    'relic_ss5': { id: 'relic_ss5', name: 'Mắt Phán Xét', rank: 'SS', hpBonus: 0, dmgBonus: 0.3, color: '#ff0000' },
    'relic_ss6': { id: 'relic_ss6', name: 'Cánh Tinh Vân', rank: 'SS', hpBonus: 0.2, dmgBonus: 0.1, color: '#ff0000' },
    'relic_ss7': { id: 'relic_ss7', name: 'Nhẫn Hư Không', rank: 'SS', hpBonus: 0.1, dmgBonus: 0.2, color: '#ff0000' },
    'relic_ssp1': { id: 'relic_ssp1', name: 'Vương Miện Khởi Nguyên', rank: 'SS+', hpBonus: 0.5, dmgBonus: 0.5, color: '#ffd700' }
};
let ownedRelics = []; 
let equippedRelic = null;
let ownedCoupons = { 'S': 0, 'SS': 0, 'SSP': 0 };

const HERO_BASE_COST = { 'A': 100, 'AA': 100, 'S': 200, 'SS': 500, 'SS+': 1000 };

const HERO_DATABASE = {
    'hero_A1': { id: 'hero_A1', name: 'Chiến Binh', rank: 'A', classRank: 'rank-A', color: '#00ffff', atkSpeed: 15, bulletSpeed: 15, maxRage: 100, ultDmg: 500, desc: 'Chém kiếm cơ bản.', ultType: 'shockwave', isEvent: false, baseCost: 50, img: null },
    'hero_AA1': { id: 'hero_AA1', name: 'Thợ Săn', rank: 'AA', classRank: 'rank-AA', color: '#00ff00', atkSpeed: 8, bulletSpeed: 20, maxRage: 120, ultDmg: 800, desc: 'Bắn cung siêu tốc.', ultType: 'shockwave', isEvent: false, baseCost: 100, img: null },
    'hero_S1': { id: 'hero_S1', name: 'Hỏa Thần', rank: 'S', classRank: 'rank-S', color: '#ff6600', atkSpeed: 20, bulletSpeed: 15, maxRage: 150, ultDmg: 1200, desc: 'Ném cầu lửa.', ultType: 'fireblast', isEvent: false, baseCost: 200, img: null },
    
    // CÁC TƯỚNG SS CƠ BẢN
    'hero_SS1': { id: 'hero_SS1', name: 'Ma Đêm', rank: 'SS', classRank: 'rank-SS', color: '#8a2be2', atkSpeed: 12, bulletSpeed: 15, maxRage: 200, ultDmg: 3000, desc: 'Triệu hồi Ác Quỷ.', ultType: 'shadow_demon', isEvent: false, baseCost: 500, img: null },
    'hero_SS_Cosmic': { id: 'hero_SS_Cosmic', name: 'Tôn Chủ Ngân Hà', rank: 'SS', classRank: 'rank-SS-cosmic', color: '#ff00ff', atkSpeed: 12, bulletSpeed: 25, maxRage: 200, ultDmg: 4000, desc: 'Vụ nổ Big Bang.', ultType: 'big_bang', isEvent: false, baseCost: 500, img: null },
    'hero_SS_Mythic': { id: 'hero_SS_Mythic', name: 'Cổ Thần Sáng Thế', rank: 'SS', classRank: 'rank-SS-mythic', color: '#ffd700', atkSpeed: 10, bulletSpeed: 30, maxRage: 200, ultDmg: 4200, desc: 'Thánh giá thanh tẩy.', ultType: 'mythic_genesis', isEvent: false, baseCost: 500, img: null },
    'hero_SS_Dragon': { id: 'hero_SS_Dragon', name: 'Thanh Long', rank: 'SS', classRank: 'rank-SS-dragon', color: '#00aaff', atkSpeed: 9, bulletSpeed: 22, maxRage: 200, ultDmg: 3800, desc: 'Rồng Thần giáng thế.', ultType: 'azure_dragon', isEvent: false, baseCost: 500, img: null },
    'hero_SS_Lily': { id: 'hero_SS_Lily', name: 'Bỉ Ngạn Tôn', rank: 'SS', classRank: 'rank-SS-lily', color: '#ff0055', atkSpeed: 10, bulletSpeed: 20, maxRage: 200, ultDmg: 4500, desc: 'Tuyệt mỹ Luân Hồi.', ultType: 'samsara_lily', isEvent: false, baseCost: 500, img: null },
    'hero_SS_Fox': { id: 'hero_SS_Fox', name: 'Cửu Vĩ Thiên Hồ', rank: 'SS', classRank: 'rank-SS-fox', color: '#ff66cc', atkSpeed: 10, bulletSpeed: 25, maxRage: 200, ultDmg: 4100, desc: 'Huyễn mộng hồ ly.', ultType: 'nine_tails', isEvent: false, baseCost: 500, img: null },
    'hero_SS_Butterfly': { id: 'hero_SS_Butterfly', name: 'Nguyệt Dạ Điệp Tôn', rank: 'SS', classRank: 'rank-SS-butterfly', color: '#cc99ff', atkSpeed: 9, bulletSpeed: 24, maxRage: 200, ultDmg: 4600, desc: 'Thần linh ánh trăng.', ultType: 'lunar_butterfly', isEvent: false, baseCost: 500, img: null },
    'hero_SS_Crystal': { id: 'hero_SS_Crystal', name: 'Băng Lăng Tinh Đế', rank: 'SS', classRank: 'rank-SS-crystal', color: '#00ffff', atkSpeed: 10, bulletSpeed: 25, maxRage: 200, ultDmg: 5000, desc: 'Lăng Kính Không Gian.', ultType: 'crystal_mirage', isEvent: false, baseCost: 500, img: null },
    'hero_SS_Deer': { id: 'hero_SS_Deer', name: 'Lộc Thần Nguyên Sinh', rank: 'SS', classRank: 'rank-SS-deer', color: '#00ff88', atkSpeed: 11, bulletSpeed: 20, maxRage: 200, ultDmg: 5800, desc: 'Thần Rừng bảo hộ.', ultType: 'forest_genesis', isEvent: false, baseCost: 500, img: null },

    // CÁC TƯỚNG SS+ CƠ BẢN
    'hero_SSP1': { id: 'hero_SSP1', name: 'Thánh Đế', rank: 'SS+', classRank: 'rank-SS-plus', color: '#ffd700', atkSpeed: 5, bulletSpeed: 25, maxRage: 250, ultDmg: 8000, desc: 'Thánh Kiếm hủy diệt.', ultType: 'divine_judgement', isEvent: false, baseCost: 1000, img: null },
    'hero_SSP_Omni': { id: 'hero_SSP_Omni', name: 'VẠN VẬT CHÚA TỂ', rank: 'SS+', classRank: 'rank-SSP-omni', color: '#ffffff', atkSpeed: 6, bulletSpeed: 30, maxRage: 300, ultDmg: 9500, desc: 'Sáng tạo và Hủy diệt.', ultType: 'omni_genesis', isEvent: false, baseCost: 1000, img: null },
    'hero_SSP_Time': { id: 'hero_SSP_Time', name: 'CHRONOS', rank: 'SS+', classRank: 'rank-SSP-time', color: '#ffcc00', atkSpeed: 7, bulletSpeed: 28, maxRage: 250, ultDmg: 9999, desc: 'Đảo ngược thời gian.', ultType: 'time_paradox', isEvent: false, baseCost: 1000, img: null },
    'hero_SSP_Mecha': { id: 'hero_SSP_Mecha', name: 'MA THẦN CƠ KHÍ', rank: 'SS+', classRank: 'rank-SSP-mecha', color: '#ff3300', atkSpeed: 6, bulletSpeed: 35, maxRage: 250, ultDmg: 9000, desc: 'Hủy Diệt Vệ Tinh. Nộ 1 GĐ (5s).', ultType: 'mecha_obliteration', isEvent: false, baseCost: 1000, img: null },

    // CÁC TƯỚNG SỰ KIỆN (NÂNG CẤP ĐẮT CHUẨN 5 TR VND)
    'hero_SS_Gojo': { id: 'hero_SS_Gojo', name: 'Gojo Satoru', rank: 'SS', classRank: 'rank-SS-gojo', color: '#00bfff', atkSpeed: 10, bulletSpeed: 20, maxRage: 200, ultDmg: 3500, desc: 'Hư Thức: Tử.', ultType: 'infinite_void', isEvent: true, baseCost: 1316, img: null },
    'hero_SSP_Sukuna': { id: 'hero_SSP_Sukuna', name: 'Sukuna', rank: 'SS+', classRank: 'rank-SS-sukuna', color: '#ff0000', atkSpeed: 8, bulletSpeed: 25, maxRage: 250, ultDmg: 8500, desc: 'Phục Ma Ngự Trác.', ultType: 'malevolent_shrine', isEvent: true, baseCost: 1316, img: null },
    'hero_EX_Kalpa': { id: 'hero_EX_Kalpa', name: 'KALPA - TẬN YÊN', rank: 'SS+', classRank: 'rank-SSP-kalpa', color: '#888888', atkSpeed: 12, bulletSpeed: 20, maxRage: 200, ultDmg: 5000, desc: 'Thức Tỉnh Kalpa.', ultType: 'kalpa_normal', isEvent: true, baseCost: 1316, img: null },
    'hero_EX_Astralis': { id: 'hero_EX_Astralis', name: 'ASTRALIS - THIÊN HÀ', rank: 'SS+', classRank: 'rank-SSP-astralis', color: '#00ffff', atkSpeed: 10, bulletSpeed: 25, maxRage: 200, ultDmg: 6000, desc: 'Nhấn V thức tỉnh.', ultType: 'astralis_normal', isEvent: true, baseCost: 1316, img: 'astralis-img' },
    'hero_EX_Buddha': { id: 'hero_EX_Buddha', name: 'VÔ THƯỢNG PHẬT TÔN', rank: 'SS+', classRank: 'rank-SSP-buddha', color: '#ffd700', atkSpeed: 10, bulletSpeed: 25, maxRage: 200, ultDmg: 6000, desc: 'Nhấn V thức tỉnh. Chân Hỏa Niết Bàn.', ultType: 'buddha_normal', isEvent: true, baseCost: 1316, img: 'buddha-img' },
    'hero_EX_Blood': { id: 'hero_EX_Blood', name: 'HUYẾT NGUYỆT MA TÔN', rank: 'SS+', classRank: 'rank-SSP-blood', color: '#ff0055', atkSpeed: 12, bulletSpeed: 25, maxRage: 200, ultDmg: 6600, desc: 'Nhấn V thức tỉnh. Trăng máu buông xuống.', ultType: 'blood_normal', isEvent: true, baseCost: 1316, img: 'blood-img' }
};

let currentHero = HERO_DATABASE['hero_A1'];
let playerObj = null;
let player2Obj = null; 
let isDualMode = false;

const GET_RANDOM_HERO = (r) => { const pool = Object.keys(HERO_DATABASE).filter(k => HERO_DATABASE[k].rank === r); return pool[Math.floor(Math.random()*pool.length)]; };
const GET_RANDOM_RELIC = (r) => { const pool = Object.keys(RELIC_DATABASE).filter(k => RELIC_DATABASE[k].rank === r); return pool[Math.floor(Math.random()*pool.length)]; };
let hasBoughtSSPlusHero = false;
let hasBoughtSSPlusRelic = false;

// ==========================================
// QUẢN LÝ LƯU TRỮ LOCAL & MULTI-ACCOUNT
// ==========================================
function saveData() {
    if (!currentAccount) return;
    ServerDB[currentAccount] = {
        password: ServerDB[currentAccount].password,
        diamonds: diamonds,
        totalRechargedKC: totalRechargedKC,
        ownedHeroes: ownedHeroes,
        ownedRelics: ownedRelics,
        ownedCoupons: ownedCoupons,
        score: globalScore,
        kills: globalKills,
        equippedRelic: equippedRelic
    };
    localStorage.setItem(DB_KEY, JSON.stringify(ServerDB));
}

function handleRegister() {
    let u = document.getElementById('auth-username').value.trim();
    let p = document.getElementById('auth-password').value.trim();
    if(!u || !p) { document.getElementById('auth-msg').innerText = "Vui lòng nhập đủ tên và mật khẩu!"; return; }
    if(ServerDB[u]) { document.getElementById('auth-msg').innerText = "Tên tài khoản đã tồn tại!"; return; }

    ServerDB[u] = {
        password: p, diamonds: 0, totalRechargedKC: 0,
        ownedHeroes: {'hero_A1': 1}, ownedRelics: [], ownedCoupons: {'S':0, 'SS':0, 'SSP':0},
        score: 0, kills: 0, equippedRelic: null
    };
    localStorage.setItem(DB_KEY, JSON.stringify(ServerDB));
    document.getElementById('auth-msg').style.color = '#00ff00';
    document.getElementById('auth-msg').innerText = "Đăng ký thành công! Hãy Đăng nhập.";
}

function handleLogin() {
    let u = document.getElementById('auth-username').value.trim();
    let p = document.getElementById('auth-password').value.trim();
    if(!u || !p) { document.getElementById('auth-msg').innerText = "Vui lòng nhập đủ thông tin!"; return; }
    
    if(ServerDB[u]) {
        if(ServerDB[u].password !== p) {
            document.getElementById('auth-msg').style.color = '#ff0055';
            document.getElementById('auth-msg').innerText = "Sai mật khẩu!"; return;
        }
        
        currentAccount = u;
        isAdmin = (u === 'admin'); 
        
        let data = ServerDB[u];
        diamonds = data.diamonds || 0;
        totalRechargedKC = data.totalRechargedKC || 0;
        ownedHeroes = data.ownedHeroes || {'hero_A1': 1};
        ownedRelics = data.ownedRelics || [];
        ownedCoupons = data.ownedCoupons || {'S':0, 'SS':0, 'SSP':0};
        globalScore = data.score || 0;
        globalKills = data.kills || 0;
        equippedRelic = data.equippedRelic || null;
        currentHero = HERO_DATABASE['hero_A1'];

        document.getElementById('auth-modal').style.display = 'none';
        updateUI();
        document.getElementById('history-modal').style.display = 'flex';
    } else {
        document.getElementById('auth-msg').style.color = '#ff0055';
        document.getElementById('auth-msg').innerText = "Tài khoản không tồn tại!";
    }
}

function exportData() {
    saveData(); 
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(localStorage.getItem(DB_KEY));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "TruyenThuyetHacAm_DB_Backup.json");
    document.body.appendChild(downloadAnchorNode); 
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if(data) {
                localStorage.setItem(DB_KEY, JSON.stringify(data));
                alert("Nhập cơ sở dữ liệu thành công! Đang tải lại trang...");
                location.reload();
            } else { alert("File không đúng định dạng!"); }
        } catch (err) { alert("Lỗi đọc file. Vui lòng thử lại!"); }
    };
    reader.readAsText(file);
}

function loadLocalData() {
    // Trực tiếp load nếu có ServerDB, nếu chưa login thì thông báo
    if(!currentAccount) {
        alert("Vui lòng đăng nhập tài khoản trước khi chơi tiếp.");
        return;
    }
    document.getElementById('auth-modal').style.display = 'none';
    updateUI();
    document.getElementById('history-modal').style.display = 'flex';
}

function startNewGame() {
    if(confirm("Xác nhận xóa toàn bộ Cơ Sở Dữ Liệu? Mọi tài khoản sẽ mất hết!")) {
        localStorage.removeItem(DB_KEY);
        localStorage.removeItem(CODE_KEY);
        ServerDB = {}; ServerCodes = {};
        diamonds = 0; totalRechargedKC = 0; ownedHeroes = {'hero_A1': 1};
        ownedRelics = []; ownedCoupons = {'S':0, 'SS':0, 'SSP':0}; globalScore = 0; globalKills = 0; equippedRelic = null;
        currentAccount = null;
        alert("Đã xóa. Vui lòng Đăng ký lại tài khoản mới!");
        location.reload();
    }
}

// ==========================================
// ADMIN PANEL
// ==========================================
window.addEventListener('keydown', e => {
    if (e.key === 'h' || e.key === 'H') {
        if(isAdmin) {
            document.getElementById('admin-modal').style.display = 'flex';
            loadLeaderboard('kc');
        }
    }
});

function switchAdminTab(tabName) {
    ['bxh', 'code', 'cheat'].forEach(t => {
        document.getElementById(`admin-${t}`).style.display = 'none';
        document.getElementById(`tab-adm-${t}`).classList.remove('active');
    });
    document.getElementById(`admin-${tabName}`).style.display = 'block';
    document.getElementById(`tab-adm-${tabName}`).classList.add('active');
    if (tabName === 'bxh') loadLeaderboard('kc');
}

function loadLeaderboard(type) {
    let arr = [];
    for (let user in ServerDB) {
        let d = ServerDB[user];
        d.username = user;
        arr.push(d);
    }
    if(type === 'kc') arr.sort((a,b) => (b.totalRechargedKC || 0) - (a.totalRechargedKC || 0));
    if(type === 'score') arr.sort((a,b) => (b.kills || 0) - (a.kills || 0));

    let html = '';
    for(let i=0; i<Math.min(10, arr.length); i++) {
        let val = type === 'kc' ? `${arr[i].totalRechargedKC} KC Nạp` : `${arr[i].kills} Kills`;
        html += `<tr><td>#${i+1}</td><td>${arr[i].username}</td><td style="color:yellow; font-weight:bold;">${val}</td></tr>`;
    }
    document.getElementById('admin-bxh-list').innerHTML = html;
}

function updateCodeRewardUI() {
    let type = document.getElementById('adm-code-type').value;
    let c = document.getElementById('adm-code-reward-container');
    if(type === 'kc') c.innerHTML = '<input type="number" id="adm-code-val" placeholder="Số Kim Cương">';
    else if(type === 'hero') {
        let options = Object.keys(HERO_DATABASE).map(k => `<option value="${k}">[${HERO_DATABASE[k].rank}] ${HERO_DATABASE[k].name}</option>`).join('');
        c.innerHTML = `<select id="adm-code-val">${options}</select>`;
    } else if(type === 'relic') {
        let options = Object.keys(RELIC_DATABASE).map(k => `<option value="${k}">[${RELIC_DATABASE[k].rank}] ${RELIC_DATABASE[k].name}</option>`).join('');
        c.innerHTML = `<select id="adm-code-val">${options}</select>`;
    }
}

function generateGiftCode() {
    let code = document.getElementById('adm-new-code').value.trim().toUpperCase();
    let type = document.getElementById('adm-code-type').value;
    let val = document.getElementById('adm-code-val').value;
    if(!code || !val) { alert("Nhập đủ thông tin!"); return; }

    ServerCodes[code] = { code: code, type: type, value: val, usedBy: [] };
    localStorage.setItem(CODE_KEY, JSON.stringify(ServerCodes));
    alert("Tạo Code thành công!");
}

function cheatKC() { diamonds += 100000000; totalRechargedKC += 100000000; updateUI(); saveData(); alert("Đã thêm 100Tr KC"); }
function cheatAllHeroes() { Object.keys(HERO_DATABASE).forEach(k => ownedHeroes[k] = 20); updateUI(); saveData(); alert("Full Tướng Lv20!"); }
function cheatAllRelics() { ownedRelics = Object.keys(RELIC_DATABASE); updateUI(); saveData(); alert("Full Bảo Vật!"); }

function redeemCode() {
    let code = document.getElementById('gift-code-input').value.trim().toUpperCase();
    if(!code) return;

    let data = ServerCodes[code];
    if (data) {
        if(data.usedBy && data.usedBy.includes(currentAccount)) { alert("Bạn đã dùng mã này rồi!"); return; }
        
        if(data.type === 'kc') diamonds += parseInt(data.value);
        else if(data.type === 'hero') {
            if(!ownedHeroes[data.value]) ownedHeroes[data.value] = 1;
            else if(ownedHeroes[data.value] < MAX_LEVEL) ownedHeroes[data.value]++;
        }
        else if(data.type === 'relic') {
            if(!ownedRelics.includes(data.value)) ownedRelics.push(data.value);
        }

        if(!data.usedBy) data.usedBy = [];
        data.usedBy.push(currentAccount);
        localStorage.setItem(CODE_KEY, JSON.stringify(ServerCodes));
        
        saveData(); updateUI();
        alert("Nhập Code thành công!");
        document.getElementById('code-modal').style.display='none';
    } else { alert("Mã Code không tồn tại hoặc đã hết hạn!"); }
}

// --- TIỆN ÍCH GAME ---
function applyDiscount(baseCost) {
    let cost = baseCost; let usedType = null; let discountAmt = 0;
    if (ownedCoupons['SSP'] > 0 && cost > 300) { discountAmt = 300; usedType = 'SSP'; }
    else if (ownedCoupons['SS'] > 0 && cost > 100) { discountAmt = 100; usedType = 'SS'; }
    else if (ownedCoupons['S'] > 0 && cost > 50) { discountAmt = 50; usedType = 'S'; }
    if (discountAmt > 0) return { finalCost: Math.max(0, cost - discountAmt), type: usedType, amt: discountAmt };
    return { finalCost: cost, type: null, amt: 0 };
}

// --- UI & MODALS ---
function updateUI() {
    document.querySelectorAll('.kc-display').forEach(el => el.innerText = diamonds.toLocaleString());
    
    let couponText = `Phiếu Giảm Giá: S(${ownedCoupons.S}) | SS(${ownedCoupons.SS}) | SS+(${ownedCoupons.SSP})`;
    if(document.getElementById('coupon-display')) document.getElementById('coupon-display').innerText = couponText;
    if(document.getElementById('coupon-display-gacha')) document.getElementById('coupon-display-gacha').innerText = couponText;

    let currentVip = getVIPLevel(totalRechargedKC);
    document.getElementById('vip-display-home').innerText = `VIP ${currentVip}`;

    const relicUI = document.getElementById('relic-icon-display');
    if(equippedRelic) {
        const rData = RELIC_DATABASE[equippedRelic];
        relicUI.innerText = rData.rank; relicUI.style.color = rData.color; relicUI.style.background = `rgba(255,255,255,0.1)`; relicUI.style.borderColor = rData.color;
    } else {
        relicUI.innerText = '❓'; relicUI.style.color = '#fff'; relicUI.style.borderColor = 'transparent';
    }

    const lvl = ownedHeroes[currentHero.id] || 1;
    document.getElementById('hero-lvl-txt').innerText = `Lv.${lvl}`;
    
    let displayName = currentHero.isEvent ? `<span class="event-tag">[Event]</span> ${currentHero.name}` : currentHero.name;
    document.getElementById('hero-name-txt').innerHTML = displayName;
    
    document.getElementById('hero-rank-txt').innerText = currentHero.rank;
    document.getElementById('hero-rank-txt').className = `hero-rank ${currentHero.classRank}`;
    document.getElementById('hero-desc-txt').innerText = currentHero.desc;
    
    const vipBonus = currentVip * 0.05; 
    const relicHp = equippedRelic ? RELIC_DATABASE[equippedRelic].hpBonus : 0;
    const relicDmg = equippedRelic ? RELIC_DATABASE[equippedRelic].dmgBonus : 0;
    
    const finalHp = Math.round((100 + (lvl - 1) * 20) * (1 + vipBonus + relicHp));
    const finalDmgMult = Math.round((1 + (lvl - 1) * 0.15) * (1 + vipBonus + relicDmg) * 100);

    document.getElementById('stat-hp').innerText = finalHp;
    document.getElementById('vip-hp-bonus').innerText = (currentVip > 0 || relicHp > 0) ? `(+${Math.round((vipBonus + relicHp)*100)}%)` : '';

    document.getElementById('stat-dmg').innerText = `${finalDmgMult}%`;
    document.getElementById('vip-dmg-bonus').innerText = (currentVip > 0 || relicDmg > 0) ? `(+${Math.round((vipBonus + relicDmg)*100)}%)` : '';
    
    const avatar = document.getElementById('hero-avatar-div');
    avatar.className = `hero-avatar ${currentHero.classRank}`;
    avatar.style.background = currentHero.color;
    avatar.style.boxShadow = `0 0 20px ${currentHero.color}`;

    // Update BG Image for Hero
    const portraitBg = document.getElementById('hero-portrait-bg');
    if(currentHero.img && document.getElementById(currentHero.img)) {
        portraitBg.style.backgroundImage = `url('${document.getElementById(currentHero.img).src}')`;
        portraitBg.style.display = 'block';
    } else {
        portraitBg.style.display = 'none';
    }
}

function switchScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    if(screenId) document.getElementById(screenId).classList.add('active');
    if(screenId === 'screen-inventory') updateInventory();
    updateUI();
}

function switchInvTab(tabName) {
    currentInvTab = tabName;
    document.getElementById('tab-normal').classList.remove('active');
    document.getElementById('tab-event').classList.remove('active');
    document.getElementById(`tab-${tabName}`).classList.add('active');
    updateInventory();
}

function updateInventory() {
    const grid = document.getElementById('inv-grid'); grid.innerHTML = '';
    const rankWeight = { 'SS+': 6, 'SS': 4, 'S': 3, 'AA': 2, 'A': 1 };
    
    let filteredHeroes = Object.keys(ownedHeroes).map(id => HERO_DATABASE[id]).filter(h => {
        if (currentInvTab === 'normal') return !h.isEvent;
        return h.isEvent;
    });

    let sortedHeroes = filteredHeroes.sort((a,b) => {
        if (rankWeight[b.rank] !== rankWeight[a.rank]) return rankWeight[b.rank] - rankWeight[a.rank];
        return ownedHeroes[b.id] - ownedHeroes[a.id];
    });

    sortedHeroes.forEach(h => {
        const lvl = ownedHeroes[h.id]; const isEq = (h.id === currentHero.id) ? 'equipped' : '';
        const baseC = h.baseCost || HERO_BASE_COST[h.rank];
        let cost = lvl * baseC;
        
        let costHtml = `${cost}💎`;
        let dInfo = applyDiscount(cost);
        if (dInfo.amt > 0) costHtml = `<s>${cost}</s> <span style="color:#00ff00;">${dInfo.finalCost}💎</span>`;

        let btnHtml = lvl < MAX_LEVEL ? `<button class="btn-upgrade" onclick="event.stopPropagation(); upgradeHero('${h.id}')">Nâng cấp (${costHtml})</button>` : `<button class="btn-upgrade" disabled>MAX LV</button>`;
        let namePrefix = h.isEvent ? `<span class="event-tag">[Event]</span><br>` : '';

        let bgImgStyle = "";
        if(h.img && document.getElementById(h.img)) {
            bgImgStyle = `background-image: url('${document.getElementById(h.img).src}'); background-size: cover; background-position: center;`;
        }

        grid.innerHTML += `
            <div class="inv-card ${isEq}" onclick="equipHero('${h.id}')" style="border-color: ${h.color}">
                <div style="position:absolute; top:0; left:0; width:100%; height:100%; opacity:0.2; z-index:0; border-radius:8px; ${bgImgStyle}"></div>
                <div class="level-badge">Lv.${lvl}</div>
                <div class="equipped-label">ĐANG DÙNG</div>
                <div class="inv-avatar ${h.classRank}" style="background: ${h.color}; box-shadow: 0 0 10px ${h.color}; z-index:1; ${bgImgStyle}"></div>
                <h4 style="color: ${h.color}; margin-bottom: 5px; font-size:12px; height: 35px; line-height: 1.2; z-index:1;">${namePrefix}${h.name}</h4>
                <div class="${h.classRank}" style="font-weight:bold; font-size:20px; margin-bottom: 10px; z-index:1;">${h.rank}</div>
                ${btnHtml}
            </div>
        `;
    });
}

function openRelicModal() {
    const grid = document.getElementById('relic-grid'); grid.innerHTML = '';
    if (ownedRelics.length === 0) { grid.innerHTML = '<p style="color:#aaa;">Bạn chưa sở hữu Bảo vật nào. Hãy mua tại Cửa Hàng VIP 7+.</p>'; } 
    else {
        ownedRelics.forEach(rId => {
            const r = RELIC_DATABASE[rId]; const isEq = (rId === equippedRelic) ? 'equipped' : '';
            let buffTxt = r.hpBonus > 0 ? `+${r.hpBonus*100}% HP` : `+${r.dmgBonus*100}% Dmg`;
            if (r.hpBonus > 0 && r.dmgBonus > 0) buffTxt = `+${r.hpBonus*100}% All`;
            grid.innerHTML += `
                <div class="inv-card ${isEq}" onclick="equipRelicFinal('${rId}')" style="border-color: ${r.color}">
                    <div class="equipped-label" style="background:${r.color};">ĐANG TRANG BỊ</div>
                    <h4 style="color: ${r.color}; margin-top:10px;">${r.name}</h4>
                    <div style="font-weight:bold; font-size:24px; color:${r.color}; margin: 10px 0;">${r.rank}</div>
                    <div style="color:#00ff00; font-size:12px; font-weight:bold;">${buffTxt}</div>
                </div>
            `;
        });
    }
    document.getElementById('relic-modal').style.display = 'flex';
}

function equipRelicFinal(id) { equippedRelic = id; document.getElementById('relic-modal').style.display = 'none'; updateUI(); saveData();}
function unequipRelic() { equippedRelic = null; document.getElementById('relic-modal').style.display = 'none'; updateUI(); saveData();}

function equipHero(id) { currentHero = HERO_DATABASE[id]; updateInventory(); updateUI(); saveData();}

function upgradeHero(id) {
    let lvl = ownedHeroes[id]; if (lvl >= MAX_LEVEL) return;
    const heroData = HERO_DATABASE[id];
    const baseC = heroData.baseCost || HERO_BASE_COST[heroData.rank];
    let originalCost = lvl * baseC;
    
    let { finalCost, type, amt } = applyDiscount(originalCost);
    
    if (diamonds >= finalCost) { 
        diamonds -= finalCost; 
        if (type) ownedCoupons[type]--;
        ownedHeroes[id]++; 
        updateInventory(); updateUI(); saveData();
    } 
    else { alert("Không đủ Kim Cương để nâng cấp!"); }
}

function showVipModal() {
    const currentVip = getVIPLevel(totalRechargedKC);
    document.getElementById('vip-status-text').innerText = `Cấp VIP hiện tại: ${currentVip}`;
    if (currentVip < 12) {
        const needed = VIP_THRESHOLDS[currentVip + 1] - totalRechargedKC;
        document.getElementById('vip-progress-text').innerText = `Tổng nạp: ${totalRechargedKC.toLocaleString()} 💎. Cần nạp thêm ${needed.toLocaleString()} 💎 để lên VIP ${currentVip + 1}`;
    } else { document.getElementById('vip-progress-text').innerText = `Tổng nạp: ${totalRechargedKC.toLocaleString()} 💎. Bạn đã đạt VIP Tối Đa!`; }
    document.getElementById('vip-modal').style.display = 'flex';
}

function showRechargeModal() { document.getElementById('recharge-modal').style.display = 'flex'; }

function confirmRecharge() {
    const val = document.getElementById('vnd-input').value; const vnd = parseInt(val);
    if (!isNaN(vnd) && vnd > 0) {
        const gainedKC = Math.floor((vnd / 1000000) * 50000);
        diamonds += gainedKC; totalRechargedKC += gainedKC;
        alert(`Giao dịch thành công! Nhận được ${gainedKC.toLocaleString()} 💎`);
        document.getElementById('recharge-modal').style.display = 'none'; updateUI(); saveData();
    } else { alert("Số VNĐ không hợp lệ!"); }
}

// --- VIP SHOP ---
let vipShopItems = []; let vipShopTimer = 10;
setInterval(() => {
    if(getVIPLevel(totalRechargedKC) >= 7) {
        vipShopTimer--;
        if(vipShopTimer <= 0) { generateVipShop(); vipShopTimer = 10; }
        updateVipShopUI();
    }
}, 1000);

function generateVipShop() {
    vipShopItems = [];
    for(let i=0; i<5; i++) {
        let r = Math.random() * 100; let item = { id: i, purchased: false };
        if (r < 0.05 && !hasBoughtSSPlusHero) { 
            item.type = 'hero'; item.dataId = GET_RANDOM_HERO('SS+'); item.price = 100000; item.rarity = 'SS+';
        } else if (r < 0.1 && !hasBoughtSSPlusRelic) { 
            item.type = 'relic'; item.dataId = 'relic_ssp1'; item.price = 150000; item.rarity = 'SS+';
        } else if (r < 5) {
            item.type = 'hero'; item.dataId = GET_RANDOM_HERO('SS'); item.price = 20000; item.rarity = 'SS';
        } else if (r < 15) {
            item.type = 'relic'; item.dataId = GET_RANDOM_RELIC('SS'); item.price = 25000; item.rarity = 'SS';
        } else if (r < 30) {
            item.type = 'coupon'; item.dataId = 'SSP'; item.price = 500; item.rarity = 'SS+'; item.desc = 'Phiếu Giảm 300 KC';
        } else if (r < 50) {
            item.type = 'coupon'; item.dataId = 'SS'; item.price = 200; item.rarity = 'SS'; item.desc = 'Phiếu Giảm 100 KC';
        } else if (r < 75) {
            item.type = 'relic'; item.dataId = GET_RANDOM_RELIC('S'); item.price = 5000; item.rarity = 'S';
        } else {
            item.type = 'coupon'; item.dataId = 'S'; item.price = 100; item.rarity = 'S'; item.desc = 'Phiếu Giảm 50 KC';
        }
        vipShopItems.push(item);
    }
}

function updateVipShopUI() {
    document.getElementById('vip-timer').innerText = `Làm mới sau: ${vipShopTimer}s`;
    const grid = document.getElementById('vip-shop-grid');
    if (grid && document.getElementById('vip-shop-modal').style.display === 'flex') {
        grid.innerHTML = '';
        vipShopItems.forEach(item => {
            let name, color, borderCls;
            if(item.type === 'hero') { name = `Tướng: ${HERO_DATABASE[item.dataId].name}`; color = HERO_DATABASE[item.dataId].color; borderCls = HERO_DATABASE[item.dataId].classRank; }
            if(item.type === 'relic') { name = `Bảo Vật: ${RELIC_DATABASE[item.dataId].name}`; color = RELIC_DATABASE[item.dataId].color; borderCls = `rank-${item.rarity.replace('+','-plus')}`; }
            if(item.type === 'coupon') { name = item.desc; color = '#00ffff'; borderCls = `rank-${item.rarity.replace('+','-plus')}`; }
            
            let cls = item.purchased ? 'shop-item sold' : 'shop-item';
            grid.innerHTML += `<div class="${cls} ${borderCls}" style="border-color:${color}; box-shadow: 0 0 10px ${color} inset;"><div class="sold-stamp">HẾT HÀNG</div><div style="font-weight:bold; font-size:18px; margin-bottom:5px; color:${color}">${item.rarity}</div><h4 style="color: ${color};">${name}</h4><div class="price">${item.price} 💎</div><button class="btn-primary" style="padding: 5px 10px; font-size: 12px; width: 100%;" onclick="buyShopItem(${item.id})">MUA</button></div>`;
        });
    }
}

function openVipShop() {
    if(getVIPLevel(totalRechargedKC) < 7) { alert("Yêu cầu đạt cấp độ VIP 7 trở lên để vào Cửa Hàng Chợ Đen!"); return; }
    if(vipShopItems.length === 0) generateVipShop();
    document.getElementById('vip-shop-modal').style.display = 'flex';
    updateVipShopUI();
}

function skipVipTimer() {
    if (diamonds >= 100) {
        diamonds -= 100;
        vipShopTimer = 10;
        generateVipShop();
        updateVipShopUI();
        updateUI();
        saveData();
    } else { alert("Không đủ 100 Kim Cương để Làm mới!"); }
}

function buyShopItem(index) {
    let item = vipShopItems[index];
    if(item.purchased) return;
    if(diamonds < item.price) { alert("Không đủ Kim Cương!"); return; }
    
    diamonds -= item.price; item.purchased = true;

    if (item.type === 'hero') {
        if(item.rarity === 'SS+') hasBoughtSSPlusHero = true;
        if (!ownedHeroes[item.dataId]) ownedHeroes[item.dataId] = 1;
        else { if (ownedHeroes[item.dataId] < MAX_LEVEL) ownedHeroes[item.dataId]++; else diamonds += 10; }
    } else if (item.type === 'relic') {
        if(item.rarity === 'SS+') hasBoughtSSPlusRelic = true;
        if (!ownedRelics.includes(item.dataId)) ownedRelics.push(item.dataId);
        else diamonds += 10; 
    } else if (item.type === 'coupon') {
        ownedCoupons[item.dataId]++;
    }
    updateUI(); updateVipShopUI(); saveData();
}

// --- GACHA ---
function rollSingleHero() {
    const rand = Math.random() * 100; let pulledId = 'hero_A1';
    
    if (rand < 0.67) pulledId = 'hero_EX_Blood'; 
    else if (rand < 1.34) pulledId = 'hero_EX_Buddha'; 
    else if (rand < 2.01) pulledId = 'hero_EX_Kalpa'; 
    else if (rand < 2.68) pulledId = 'hero_SSP_Sukuna'; 
    else if (rand < 3.35) pulledId = 'hero_SS_Gojo'; 
    
    else if (rand < 3.72) pulledId = 'hero_SSP_Mecha'; 
    else if (rand < 4.10) pulledId = 'hero_SSP_Omni'; 
    else if (rand < 4.47) pulledId = 'hero_SSP_Time'; 
    else if (rand < 4.85) pulledId = 'hero_SSP1'; 
    
    else if (rand < 9.85) pulledId = 'hero_SS_Crystal'; 
    else if (rand < 14.85) pulledId = 'hero_SS_Butterfly'; 
    else if (rand < 19.85) pulledId = 'hero_SS_Fox';  
    else if (rand < 24.85) pulledId = 'hero_SS_Lily';  
    else if (rand < 29.85) pulledId = 'hero_SS_Dragon';  
    else if (rand < 34.85) pulledId = 'hero_SS_Mythic'; 
    else if (rand < 39.85) pulledId = 'hero_SS_Cosmic'; 
    else if (rand < 44.85) pulledId = 'hero_SS1'; 
    else if (rand < 48.0) pulledId = 'hero_SS_Deer';
    
    else if (rand < 65.0) pulledId = 'hero_S1'; 
    else if (rand < 85.0) pulledId = 'hero_AA1'; 
    else pulledId = 'hero_A1'; 
    
    let isDup = false; let compensate = false;
    if (!ownedHeroes[pulledId]) { ownedHeroes[pulledId] = 1; } 
    else {
        isDup = true;
        if (HERO_DATABASE[pulledId].isEvent) { compensate = true; diamonds += 10; } 
        else { if (ownedHeroes[pulledId] < MAX_LEVEL) ownedHeroes[pulledId]++; else { compensate = true; diamonds += 10; } }
    }
    return { hero: HERO_DATABASE[pulledId], isDup, compensate };
}

function rollGacha(times) {
    let baseCost = times * 100;
    let { finalCost, type, amt } = applyDiscount(baseCost);

    if (diamonds < finalCost) { alert("Không đủ Kim Cương! Hãy nạp thêm."); return; }
    diamonds -= finalCost; 
    if (type) ownedCoupons[type]--; 
    
    saveData(); updateUI();

    const altar = document.getElementById('altar'); altar.style.animationDuration = '0.1s'; 

    setTimeout(() => {
        altar.style.animationDuration = '2s'; 
        const popup = document.getElementById('gacha-popup'); const grid = document.getElementById('popup-grid');
        grid.innerHTML = ''; let bestHero = null; const rankW = { 'A': 1, 'AA': 2, 'S': 3, 'SS': 4, 'SS+': 5 };

        for(let i=0; i<times; i++) {
            const result = rollSingleHero(); const h = result.hero;
            if (!bestHero || rankW[h.rank] > rankW[bestHero.rank]) bestHero = h;
            
            let badgeHtml = '';
            if (h.isEvent && result.isDup) badgeHtml = `<div class="dup-badge" style="background:#888">+10💎</div>`;
            else if (result.compensate) badgeHtml = `<div class="dup-badge" style="background:#888">+10💎</div>`;
            else if (result.isDup) badgeHtml = `<div class="dup-badge">+1 Lv</div>`;
            else badgeHtml = `<div class="dup-badge" style="background:#28a745">MỚI!</div>`;

            setTimeout(() => {
                grid.innerHTML += `<div class="gacha-item ${h.classRank}" style="border-color: ${h.color}; color: ${h.color}">${badgeHtml}<div style="font-size:24px;">${h.rank}</div><div style="font-size:12px;">${h.name}</div></div>`;
            }, i * 100);
        }
        popup.style.display = 'flex';
        if (rankW[bestHero.rank] > rankW[currentHero.rank]) currentHero = bestHero;
        saveData(); 
    }, 1000);
}

// ==========================================
// GAME ENGINE CANVAS
// ==========================================
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameUI = document.getElementById('game-ui');
let gameLoopId; let isPlaying = false; let isPaused = false;

let width, height;
function resize() { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; }
window.addEventListener('resize', resize); resize();

const mouse = { x: width/2, y: height/2 };

let entities = { enemies: [], bosses: [], projectiles: [], floatingTexts: [], envEffects: [] };
let gameData = { score: 0, frameCount: 0, screenShake: 0, timeScale: 1, nextBossScore: 10, currentBossLevel: 0, awakenEnemies: 0, awakenBosses: 0 };

window.addEventListener('mousemove', e => { if(isPlaying && !isPaused) { mouse.x = e.clientX; mouse.y = e.clientY; }});
window.addEventListener('keydown', e => { 
    if (!isPlaying) return;
    if (e.code === 'Space') { e.preventDefault(); if(!isPaused && playerObj) playerObj.triggerUltimate(); }
    if (e.key === 'n' || e.key === 'N') toggleSkipMenu();
    if (e.key === 'v' || e.key === 'V') {
        if(!isPaused && playerObj && HERO_DATABASE[playerObj.hero.id].isEvent && playerObj.hero.id !== 'hero_SS_Gojo' && playerObj.hero.id !== 'hero_SSP_Sukuna') {
            playerObj.triggerAwakening();
        }
    }
});
canvas.addEventListener('mousedown', e => { if (isPlaying && !isPaused && playerObj) playerObj.triggerUltimate(); });

function toggleSkipMenu() {
    if(!isPlaying) return; isPaused = !isPaused; const menu = document.getElementById('skip-menu');
    if(isPaused) { menu.style.display = 'block'; document.getElementById('skip-level-input').value = ''; document.getElementById('skip-level-input').focus(); } 
    else { menu.style.display = 'none'; }
}

function executeSkip() {
    let val = parseInt(document.getElementById('skip-level-input').value);
    if(isNaN(val) || val < 1) { alert("Vui lòng nhập số hợp lệ lớn hơn 0"); return; }
    
    gameData.currentBossLevel = val - 1; gameData.score = (val - 1) * 10; gameData.nextBossScore = val * 10;
    entities.enemies = []; entities.bosses = []; entities.projectiles = [];
    document.getElementById('score-val').innerText = gameData.score; document.getElementById('next-boss-val').innerText = gameData.nextBossScore;
    
    toggleSkipMenu();
    gameData.currentBossLevel++; entities.bosses.push(new Boss(gameData.currentBossLevel)); gameData.nextBossScore += 10;
    entities.floatingTexts.push(new FloatingText(width/2, height/2 - 100, `TEST BOSS LV ${val}`, "#00ffff", 50));
}

function openDualMenu() {
    const m = document.getElementById('dual-modal');
    const s1 = document.getElementById('p1-select');
    const s2 = document.getElementById('p2-select');
    s1.innerHTML = ''; s2.innerHTML = '';
    Object.keys(ownedHeroes).forEach(id => {
        let h = HERO_DATABASE[id];
        let opt = `<option value="${id}">${h.name} (Lv.${ownedHeroes[id]})</option>`;
        s1.innerHTML += opt; s2.innerHTML += opt;
    });
    s1.value = currentHero.id;
    m.style.display = 'flex';
}

function startGame(isDual) {
    if(document.activeElement) document.activeElement.blur();
    document.getElementById('dual-modal').style.display = 'none';
    switchScreen(null); canvas.style.display = 'block'; gameUI.style.display = 'block'; document.getElementById('boss-ui').style.display = 'none'; 
    isPlaying = true;
    
    isDualMode = isDual;

    if(HERO_DATABASE[currentHero.id].isEvent && currentHero.id !== 'hero_SS_Gojo' && currentHero.id !== 'hero_SSP_Sukuna') {
        document.getElementById('awaken-container').style.display = 'block';
        document.getElementById('awaken-bar').style.width = '0%';
        document.getElementById('awaken-hint').style.display = 'none';
    } else { document.getElementById('awaken-container').style.display = 'none'; }

    playerObj = new Player(currentHero); 
    
    if (isDualMode) {
        let p2Id = document.getElementById('p2-select').value;
        player2Obj = new AIPlayer(HERO_DATABASE[p2Id]);
    } else { player2Obj = null; }

    entities = { enemies: [], bosses: [], projectiles: [], floatingTexts: [], envEffects: [] };
    gameData = { score: 0, frameCount: 0, screenShake: 0, timeScale: 1, nextBossScore: 10, currentBossLevel: 0, awakenEnemies: 0, awakenBosses: 0 };
    document.getElementById('score-val').innerText = '0'; document.getElementById('next-boss-val').innerText = '10';
    gameLoopId = requestAnimationFrame(gameLoop);
}

function startDualGame() {
    let p1Id = document.getElementById('p1-select').value;
    currentHero = HERO_DATABASE[p1Id];
    startGame(true);
}

function exitGame(isDead = false) {
    isPlaying = false; isPaused = false; playerObj = null; player2Obj = null; isDualMode = false; cancelAnimationFrame(gameLoopId); 
    canvas.style.display = 'none'; gameUI.style.display = 'none'; switchScreen('screen-home');
    document.getElementById('skip-menu').style.display = 'none';
    globalScore = Math.max(globalScore, gameData.score); globalKills += gameData.score;
    saveData();
    if(isDead) alert(`Bạn đã bị hạ gục! Diệt được ${gameData.score} sinh vật.`);
}

// CLASSES
class Player {
    constructor(heroData) {
        this.x = width / 2; this.y = height / 2;
        this.hero = heroData; this.radius = 18;
        this.playerId = Math.random();
        
        const lvl = ownedHeroes[this.hero.id] || 1;
        const currentVip = getVIPLevel(totalRechargedKC); const vipBonus = currentVip * 0.05;
        const relicHp = equippedRelic ? RELIC_DATABASE[equippedRelic].hpBonus : 0;
        const relicDmg = equippedRelic ? RELIC_DATABASE[equippedRelic].dmgBonus : 0;
        
        this.damageMultiplier = (1 + (lvl - 1) * 0.15) * (1 + vipBonus + relicDmg);
        this.maxHp = (100 + (lvl - 1) * 20) * (1 + vipBonus + relicHp);
        this.hp = this.maxHp; this.rage = 0; this.attackTimer = 0; 
        this.ultState = 0; this.ultTimer = 0;

        this.isAwakened = false; this.isAwakeningAnim = false;
    }

    update() {
        if (this.ultState > 0 || this.isAwakeningAnim) { this.processUltimate(); return; }

        const dx = mouse.x - this.x; const dy = mouse.y - this.y; const dist = Math.hypot(dx, dy);
        if (dist > 5) { this.x += (dx / dist) * 6 * gameData.timeScale; this.y += (dy / dist) * 6 * gameData.timeScale; }

        this.attackTimer += gameData.timeScale;
        if (this.attackTimer >= this.hero.atkSpeed) { this.fire(); this.attackTimer = 0; }

        if (this === playerObj) {
            document.getElementById('hp-bar').style.width = Math.max(0, (this.hp / this.maxHp * 100)) + '%';
            document.getElementById('rage-bar').style.width = (this.rage / this.hero.maxRage * 100) + '%';
            document.getElementById('rage-hint').style.display = (this.rage >= this.hero.maxRage && !this.isAwakeningAnim) ? 'block' : 'none';
        }
    }

    fire() {
        let targets = [...entities.bosses, ...entities.enemies]; if (targets.length === 0) return;
        let nearest = null; let minDist = Infinity;
        targets.forEach(e => { let d = Math.hypot(e.x - this.x, e.y - this.y); if(d < minDist) { minDist = d; nearest = e; } });
        if (nearest && minDist < 800) { const angle = Math.atan2(nearest.y - this.y, nearest.x - this.x); entities.projectiles.push(new Projectile(this.x, this.y, angle, this)); }
    }

    triggerUltimate() {
        if (this.rage >= this.hero.maxRage && this.ultState === 0 && !this.isAwakeningAnim) { 
            this.rage = 0; this.ultState = 1; this.ultTimer = 0; 
        }
    }

    triggerAwakening() {
        if (!this.isAwakened && gameData.awakenEnemies >= 30 && gameData.awakenBosses >= 2 && this.ultState === 0) {
            this.isAwakeningAnim = true; this.ultTimer = 0;
            if(this === playerObj) document.getElementById('awaken-hint').style.display = 'none';
        }
    }

    processUltimate() {
        this.ultTimer++; let t = this.ultTimer; 
        
        if (this.isAwakeningAnim) {
            gameData.timeScale = 0;
            let typeAwk = this.hero.id === 'hero_EX_Buddha' ? 'buddha_awaken' : (this.hero.id === 'hero_EX_Blood' ? 'blood_awaken' : 'kalpa_awaken');
            let limit = 240; 
            if(this.hero.id === 'hero_EX_Kalpa') limit = 300;

            let effId = typeAwk + '_' + this.playerId;
            let eff = entities.envEffects.find(e => e.id === effId);
            if (!eff) entities.envEffects.push({id: effId, type: typeAwk, timer: t, maxT: limit, x: this.x, y: this.y, targets: [...entities.enemies, ...entities.bosses]});
            else eff.timer = t;

            if (typeAwk === 'kalpa_awaken') {
                if (t < 200) gameData.screenShake = 2; else if (t < 290) gameData.screenShake = 15;
                else if (t === 291) {
                    gameData.screenShake = 50; [...entities.enemies, ...entities.bosses].forEach(e => { e.hp -= 20000 * this.damageMultiplier; });
                    entities.floatingTexts.push(new FloatingText(width/2, height/2 - 50, "THỨC TỈNH!", "#00ffff", 80)); this.isAwakened = true;
                }
            } else if (typeAwk === 'buddha_awaken') { 
                if (t < 150) gameData.screenShake = 5; else if (t < 230) gameData.screenShake = 20;
                else if (t === 231) {
                    gameData.screenShake = 60; [...entities.enemies, ...entities.bosses].forEach(e => { e.hp -= 20000 * this.damageMultiplier; });
                    entities.floatingTexts.push(new FloatingText(width/2, height/2 - 50, "NIẾT BÀN!", "#ffd700", 80)); this.isAwakened = true;
                }
            } else if (typeAwk === 'blood_awaken') {
                if (t < 150) gameData.screenShake = 2; else if (t < 230) gameData.screenShake = 15;
                else if (t === 231) {
                    gameData.screenShake = 60; [...entities.enemies, ...entities.bosses].forEach(e => { e.hp -= 20000 * this.damageMultiplier; });
                    entities.floatingTexts.push(new FloatingText(width/2, height/2 - 50, "HUYẾT NGUYỆT!", "#ff0055", 80)); this.isAwakened = true;
                }
            }

            if (t >= limit) { this.isAwakeningAnim = false; gameData.timeScale = 1; entities.envEffects = entities.envEffects.filter(e => e.id !== effId); }
            return; 
        }

        let d = this.hero.ultDmg * this.damageMultiplier;
        let maxT = 180; let phases = 6; 
        let p1 = 30, p2 = 60, p3 = 90, p4 = 120, p5 = 150, p6 = 180, p7 = 0;

        let type = this.hero.ultType;
        
        if (this.hero.ultType === 'mecha_obliteration') { maxT = 300; phases = 1; type = 'mecha_obliteration'; }
        else if (this.hero.id === 'hero_EX_Kalpa') {
            if (this.isAwakened) { type = 'kalpa_awakened'; maxT = 360; phases = 7; p1=51; p2=102; p3=153; p4=204; p5=255; p6=306; p7=360; d = d * 10; } 
            else { type = 'kalpa_normal'; maxT = 300; phases = 5; p1=60; p2=120; p3=180; p4=240; }
        }
        else if (this.hero.id === 'hero_EX_Buddha') {
            if (this.isAwakened) { type = 'buddha_awakened'; maxT = 420; phases = 7; p1=60; p2=120; p3=180; p4=240; p5=300; p6=360; p7=420; d = d * 10; } 
            else { type = 'buddha_normal'; maxT = 300; phases = 5; p1=60; p2=120; p3=180; p4=240; }
        }
        else if (this.hero.id === 'hero_EX_Blood') {
            if (this.isAwakened) { type = 'blood_awakened'; maxT = 420; phases = 2; p1=210; p2=420; d = d * 10; } 
            else { type = 'blood_normal'; maxT = 300; phases = 5; p1=60; p2=120; p3=180; p4=240; } 
        }
        else if (this.hero.id === 'hero_EX_Astralis') {
            if (this.isAwakened) { type = 'astralis_awakened'; maxT = 420; phases = 7; p1=60; p2=120; p3=180; p4=240; p5=300; p6=360; p7=420; d = d * 10; } 
            else { type = 'astralis_normal'; maxT = 300; phases = 5; p1=60; p2=120; p3=180; p4=240; }
        }

        let effId = type + '_' + this.playerId;
        let eff = entities.envEffects.find(e => e.id === effId);
        if (!eff) entities.envEffects.push({id: effId, type: type, timer: t, maxT: maxT, x: this.x, y: this.y, targets: [...entities.enemies, ...entities.bosses]});
        else eff.timer = t;

        gameData.timeScale = 0;

        if (phases === 1) {
            if (t < 100) gameData.screenShake = 1;
            else if (t < 200) gameData.screenShake = 3;
            else if (t < 280) {
                gameData.screenShake = 50; 
                if (t === 201) { [...entities.enemies, ...entities.bosses].forEach(e => { e.hp -= d; }); entities.floatingTexts.push(new FloatingText(width/2, height/2 - 50, "VỆ TINH HỦY DIỆT!", "#ff3300", 80)); }
            } else gameData.screenShake = 5;
        }
        else if (phases === 2) { 
            if (t < p1) gameData.screenShake = 5;
            else if (t < p2) {
                gameData.screenShake = 60;
                if (t === p1 + 1) { [...entities.enemies, ...entities.bosses].forEach(e => { e.hp -= d; }); entities.floatingTexts.push(new FloatingText(width/2, height/2 - 50, "HUYẾT NGUYỆT TẬN DIỆT!", "#ff0055", 80)); }
            }
        }
        else if (phases === 7) { 
            if (t < p1) gameData.screenShake = 2; else if (t < p2) gameData.screenShake = 5; else if (t < p3) gameData.screenShake = 10;
            else if (t < p4) gameData.screenShake = 20; else if (t < p5) gameData.screenShake = 30;
            else if (t < p6) {
                gameData.screenShake = 60;
                if (t === Math.floor(p5) + 1) { [...entities.enemies, ...entities.bosses].forEach(e => { e.hp -= d; }); entities.floatingTexts.push(new FloatingText(width/2, height/2 - 50, "ĐẠI KIẾP!", "#ffd700", 80)); }
            } else gameData.screenShake = 0;
        } 
        else if (phases === 5) {
            if (t < p1) gameData.screenShake = 2; else if (t < p2) gameData.screenShake = 5; else if (t < p3) gameData.screenShake = 15;
            else if (t < p4) {
                gameData.screenShake = 40;
                if (t === Math.floor(p3) + 1) { [...entities.enemies, ...entities.bosses].forEach(e => { e.hp -= d; }); entities.floatingTexts.push(new FloatingText(width/2, height/2 - 50, "TẬN DIỆT!", "#fff", 60)); }
            } else gameData.screenShake = 2;
        }
        else { 
            if (t < p1) gameData.screenShake = 2; else if (t < p2) gameData.screenShake = 5; else if (t < p3) gameData.screenShake = 15; 
            else if (t < p4) gameData.screenShake = 20; 
            else if (t < p5) { 
                gameData.screenShake = 45; 
                if (t === p4 + 1) { 
                    let txt = "TUYỆT KỸ!"; if(this.hero.rank === 'SS') txt = "LÃNH ĐỊA!"; if(this.hero.rank === 'SS+') txt = "THẦN PHẠT!";
                    [...entities.enemies, ...entities.bosses].forEach(e => { e.hp -= d; }); entities.floatingTexts.push(new FloatingText(width/2, height/2 - 50, txt, this.hero.color, 60));
                    if (this.hero.id === 'hero_SSP_Omni') this.hp = this.maxHp; 
                }
            } else gameData.screenShake = 5; 
        }

        if (t >= maxT) { this.ultState = 0; gameData.timeScale = 1; entities.envEffects = entities.envEffects.filter(e => e.id !== effId); }
    }

    draw() {
        if (this.hero.id === 'hero_SSP_Mecha') {
            ctx.save(); ctx.translate(this.x, this.y);
            ctx.fillStyle = '#555'; ctx.fillRect(-this.radius-10, -5, 8, 10); ctx.fillRect(this.radius+2, -5, 8, 10);
            ctx.fillStyle = '#222'; ctx.strokeStyle = '#ff3300'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(0, -this.radius); ctx.lineTo(this.radius, 0); ctx.lineTo(0, this.radius); ctx.lineTo(-this.radius, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#ff0000'; ctx.shadowBlur = 10; ctx.shadowColor = '#ff0000'; ctx.fillRect(-5, -2, 10, 4);
            ctx.restore();
            if(this instanceof AIPlayer) { ctx.fillStyle = 'rgba(255,0,0,0.5)'; ctx.font = "10px Arial"; ctx.fillText("P2", this.x-8, this.y - this.radius - 5); }
            return;
        }

        if (this.hero.id === 'hero_EX_Astralis') {
            ctx.save(); ctx.translate(this.x, this.y);
            if (this.isAwakened) {
                ctx.rotate(gameData.frameCount * 0.1); ctx.fillStyle = '#000'; ctx.shadowBlur = 30; ctx.shadowColor = '#ff00ff'; ctx.beginPath(); ctx.arc(0,0, this.radius+5, 0, Math.PI*2); ctx.fill();
                ctx.strokeStyle = '#00ffff'; ctx.lineWidth=2; ctx.beginPath(); ctx.ellipse(0,0, this.radius*2, this.radius*0.5, 0, 0, Math.PI*2); ctx.stroke(); ctx.beginPath(); ctx.ellipse(0,0, this.radius*2, this.radius*0.5, Math.PI/2, 0, Math.PI*2); ctx.stroke();
            } else {
                ctx.rotate(gameData.frameCount * 0.02); ctx.fillStyle = '#ffffff'; ctx.shadowBlur = 20; ctx.shadowColor = '#00ffff'; ctx.beginPath(); ctx.arc(0,0, this.radius, 0, Math.PI*2); ctx.fill();
                const img = document.getElementById('astralis-img');
                if(img && img.complete) { ctx.save(); ctx.beginPath(); ctx.arc(0,0, this.radius, 0, Math.PI*2); ctx.clip(); ctx.globalAlpha = 0.8; ctx.drawImage(img, -this.radius, -this.radius, this.radius*2, this.radius*2); ctx.restore(); }
                ctx.strokeStyle = '#ffd700'; ctx.lineWidth=3; ctx.beginPath(); ctx.arc(0,0, this.radius+8, 0, Math.PI*2); ctx.stroke();
            }
            ctx.restore();
            if(this instanceof AIPlayer) { ctx.fillStyle = 'rgba(255,0,0,0.5)'; ctx.font = "10px Arial"; ctx.fillText("P2", this.x-8, this.y - this.radius - 5); }
            return;
        }

        if (this.hero.id === 'hero_EX_Buddha') {
            ctx.save(); ctx.translate(this.x, this.y);
            if (this.isAwakened) {
                ctx.rotate(gameData.frameCount * 0.05); ctx.fillStyle = '#ffd700'; ctx.shadowBlur = 30; ctx.shadowColor = '#ffaa00';
                for(let i=0; i<8; i++) { ctx.rotate(Math.PI/4); ctx.beginPath(); ctx.ellipse(0, -this.radius-5, 5, 20, 0, 0, Math.PI*2); ctx.fill(); }
                ctx.beginPath(); ctx.arc(0,0, this.radius, 0, Math.PI*2); ctx.fill();
                ctx.rotate(-gameData.frameCount * 0.05); ctx.strokeStyle = '#ffffff'; ctx.lineWidth=2;
                ctx.beginPath(); ctx.moveTo(-5,0); ctx.lineTo(5,0); ctx.moveTo(0,-5); ctx.lineTo(0,5); ctx.moveTo(-5,-5); ctx.lineTo(-5,0); ctx.moveTo(5,5); ctx.lineTo(5,0); ctx.moveTo(-5,5); ctx.lineTo(0,5); ctx.moveTo(5,-5); ctx.lineTo(0,-5); ctx.stroke();
            } else {
                ctx.fillStyle = '#ffaa00'; ctx.shadowBlur = 20; ctx.shadowColor = '#ffd700'; ctx.beginPath(); ctx.arc(0,0, this.radius, 0, Math.PI*2); ctx.fill();
                const img = document.getElementById('buddha-img');
                if(img && img.complete) { ctx.save(); ctx.beginPath(); ctx.arc(0,0, this.radius, 0, Math.PI*2); ctx.clip(); ctx.globalAlpha = 0.8; ctx.drawImage(img, -this.radius, -this.radius, this.radius*2, this.radius*2); ctx.restore(); }
                ctx.fillStyle = '#ffd700'; ctx.beginPath(); ctx.ellipse(-8, this.radius+2, 10, 5, -Math.PI/6, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.ellipse(8, this.radius+2, 10, 5, Math.PI/6, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.ellipse(0, this.radius+4, 12, 6, 0, 0, Math.PI*2); ctx.fill();
            }
            ctx.restore();
            if(this instanceof AIPlayer) { ctx.fillStyle = 'rgba(255,0,0,0.5)'; ctx.font = "10px Arial"; ctx.fillText("P2", this.x-8, this.y - this.radius - 5); }
            return;
        }

        if (this.hero.id === 'hero_EX_Blood') {
            ctx.save(); ctx.translate(this.x, this.y);
            if (this.isAwakened) {
                ctx.rotate(gameData.frameCount * 0.1); ctx.fillStyle = '#110000'; ctx.shadowBlur = 40; ctx.shadowColor = '#ff0055'; ctx.beginPath(); ctx.arc(0,0, this.radius+5, 0, Math.PI*2); ctx.fill();
                ctx.strokeStyle = '#ff0000'; ctx.lineWidth=3; for(let i=0; i<6; i++){ ctx.rotate(Math.PI*2/6); ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(0, -this.radius-15); ctx.stroke(); }
                ctx.fillStyle = '#ff0055'; ctx.beginPath(); ctx.arc(0,0, 5, 0, Math.PI*2); ctx.fill();
            } else {
                ctx.rotate(Math.sin(gameData.frameCount*0.05)*0.2); ctx.fillStyle = '#ff0000'; ctx.shadowBlur = 20; ctx.shadowColor = '#ff0055'; ctx.beginPath(); ctx.arc(0,0, this.radius, 0, Math.PI*2); ctx.fill();
                const img = document.getElementById('blood-img');
                if(img && img.complete) { ctx.save(); ctx.beginPath(); ctx.arc(0,0, this.radius, 0, Math.PI*2); ctx.clip(); ctx.globalAlpha = 0.8; ctx.drawImage(img, -this.radius, -this.radius, this.radius*2, this.radius*2); ctx.restore(); }
                ctx.strokeStyle = '#ff0055'; ctx.lineWidth=3; ctx.beginPath(); ctx.arc(0,0, this.radius+10, Math.PI/4, Math.PI); ctx.stroke();
            }
            ctx.restore();
            if(this instanceof AIPlayer) { ctx.fillStyle = 'rgba(255,0,0,0.5)'; ctx.font = "10px Arial"; ctx.fillText("P2", this.x-8, this.y - this.radius - 5); }
            return;
        }

        if (this.hero.id === 'hero_EX_Kalpa') {
            ctx.save(); ctx.translate(this.x, this.y);
            if (this.isAwakened) {
                ctx.rotate(gameData.frameCount * 0.05); ctx.fillStyle = '#00ffff'; ctx.shadowBlur = 30; ctx.shadowColor = '#ff00ff'; ctx.beginPath(); ctx.moveTo(0, -this.radius-10); ctx.lineTo(this.radius+10, 0); ctx.lineTo(0, this.radius+10); ctx.lineTo(-this.radius-10, 0); ctx.fill();
                ctx.rotate(Math.PI/4); ctx.fillStyle = '#ff00ff'; ctx.beginPath(); ctx.moveTo(0, -this.radius-10); ctx.lineTo(this.radius+10, 0); ctx.lineTo(0, this.radius+10); ctx.lineTo(-this.radius-10, 0); ctx.fill();
                ctx.beginPath(); ctx.arc(0,0, this.radius-5, 0, Math.PI*2); ctx.fillStyle='#ffffff'; ctx.fill();
            } else {
                ctx.rotate(gameData.frameCount * 0.02); ctx.fillStyle = '#888888'; ctx.shadowBlur = 15; ctx.shadowColor = '#ffffff'; ctx.fillRect(-15, -15, 30, 30); ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2; ctx.strokeRect(-20, -20, 40, 40);
            }
            ctx.restore(); 
            if(this instanceof AIPlayer) { ctx.fillStyle = 'rgba(255,0,0,0.5)'; ctx.font = "10px Arial"; ctx.fillText("P2", this.x-8, this.y - this.radius - 5); }
            return;
        }

        // CÁC MODEL CŨ ...
        if (this.hero.id === 'hero_A1') { ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(Math.atan2(mouse.y - this.y, mouse.x - this.x)); ctx.fillStyle = this.hero.color; ctx.beginPath(); ctx.arc(0,0, this.radius, 0, Math.PI*2); ctx.fill(); ctx.fillStyle = '#fff'; ctx.fillRect(10, -3, 20, 6); ctx.restore(); }
        else if (this.hero.id === 'hero_AA1') { ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(Math.atan2(mouse.y - this.y, mouse.x - this.x)); ctx.fillStyle = this.hero.color; ctx.beginPath(); ctx.arc(0,0, this.radius, 0, Math.PI*2); ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(10, 0, 15, -Math.PI/2, Math.PI/2); ctx.stroke(); ctx.restore(); }
        else if (this.hero.id === 'hero_S1') { ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(gameData.frameCount*0.1); ctx.fillStyle = this.hero.color; ctx.shadowBlur=20; ctx.shadowColor='#ff0000'; ctx.beginPath(); ctx.arc(0,0, this.radius, 0, Math.PI*2); ctx.fill(); ctx.fillStyle = '#ff0000'; ctx.beginPath(); ctx.arc(15,0, 5, 0, Math.PI*2); ctx.arc(-15,0, 5, 0, Math.PI*2); ctx.fill(); ctx.restore(); }
        else if (this.hero.id === 'hero_SS1') { ctx.save(); ctx.translate(this.x, this.y); ctx.fillStyle = '#110022'; ctx.shadowBlur = 20; ctx.shadowColor = '#8a2be2'; ctx.beginPath(); ctx.moveTo(0, -this.radius); ctx.lineTo(-this.radius, this.radius); ctx.lineTo(this.radius, this.radius); ctx.fill(); ctx.fillStyle = '#ff0000'; ctx.beginPath(); ctx.arc(-5, -2, 2, 0, Math.PI*2); ctx.arc(5, -2, 2, 0, Math.PI*2); ctx.fill(); ctx.restore(); }
        else if (this.hero.id === 'hero_SS_Gojo') { ctx.save(); ctx.translate(this.x, this.y); ctx.fillStyle = '#000'; ctx.shadowBlur = 20; ctx.shadowColor = '#00ffff'; ctx.beginPath(); ctx.arc(0,0, this.radius, 0, Math.PI*2); ctx.fill(); ctx.fillStyle = '#fff'; ctx.fillRect(-this.radius, -5, this.radius*2, 8); ctx.fillStyle = '#00bfff'; ctx.beginPath(); ctx.arc(0, 10, 3, 0, Math.PI*2); ctx.fill(); ctx.restore(); }
        else if (this.hero.id === 'hero_SS_Cosmic') { ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(gameData.frameCount*0.05); ctx.fillStyle = '#1a0033'; ctx.shadowBlur = 30; ctx.shadowColor = '#ff00ff'; ctx.beginPath(); ctx.arc(0,0, this.radius, 0, Math.PI*2); ctx.fill(); ctx.strokeStyle = '#00ffff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(0,0, this.radius*1.8, this.radius*0.5, 0, 0, Math.PI*2); ctx.stroke(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0,0, this.radius*0.4, 0, Math.PI*2); ctx.fill(); ctx.restore(); }
        else if (this.hero.id === 'hero_SS_Mythic') { ctx.save(); ctx.translate(this.x, this.y); ctx.fillStyle = '#fff'; ctx.shadowBlur = 20; ctx.shadowColor = '#ffd700'; ctx.beginPath(); ctx.arc(0,0, this.radius, 0, Math.PI*2); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.beginPath(); ctx.ellipse(-15,0, 10,20, -Math.PI/4, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.ellipse(15,0, 10,20, Math.PI/4, 0, Math.PI*2); ctx.fill(); ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(0,-20, 12,4, 0, 0, Math.PI*2); ctx.stroke(); ctx.restore(); }
        else if (this.hero.id === 'hero_SS_Dragon') { ctx.save(); ctx.translate(this.x, this.y); ctx.fillStyle = '#fff'; ctx.shadowBlur = 20; ctx.shadowColor = '#00ffff'; ctx.beginPath(); ctx.arc(0,0, this.radius, 0, Math.PI*2); ctx.fill(); ctx.fillStyle = '#00aaff'; ctx.beginPath(); ctx.moveTo(-10,-10); ctx.lineTo(-20,-25); ctx.lineTo(-5,-15); ctx.fill(); ctx.beginPath(); ctx.moveTo(10,-10); ctx.lineTo(20,-25); ctx.lineTo(5,-15); ctx.fill(); ctx.restore(); }
        else if (this.hero.id === 'hero_SS_Lily') { ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(gameData.frameCount*0.02); ctx.fillStyle = '#1a0011'; ctx.shadowBlur = 20; ctx.shadowColor = '#ff0055'; ctx.beginPath(); ctx.arc(0,0, this.radius, 0, Math.PI*2); ctx.fill(); ctx.strokeStyle = '#ff0055'; ctx.lineWidth = 2; for(let i=0; i<5; i++) { ctx.rotate(Math.PI*2/5); ctx.beginPath(); ctx.moveTo(0,5); ctx.quadraticCurveTo(15,20, 5,30); ctx.stroke(); } ctx.restore(); }
        else if (this.hero.id === 'hero_SS_Fox') { ctx.save(); ctx.translate(this.x, this.y); ctx.fillStyle = '#fff'; ctx.shadowBlur = 20; ctx.shadowColor = '#ff66cc'; ctx.beginPath(); ctx.arc(0,0, this.radius, 0, Math.PI*2); ctx.fill(); ctx.fillStyle = '#ff66cc'; ctx.beginPath(); ctx.moveTo(-5,-10); ctx.lineTo(-15,-20); ctx.lineTo(-10,-5); ctx.fill(); ctx.beginPath(); ctx.moveTo(5,-10); ctx.lineTo(15,-20); ctx.lineTo(10,-5); ctx.fill(); ctx.restore(); }
        else if (this.hero.id === 'hero_SS_Butterfly') { ctx.save(); ctx.translate(this.x, this.y); ctx.fillStyle = '#fff'; ctx.shadowBlur = 20; ctx.shadowColor = '#cc99ff'; ctx.beginPath(); ctx.arc(0,0, this.radius, 0, Math.PI*2); ctx.fill(); let flap = Math.sin(gameData.frameCount*0.2)*0.3; ctx.fillStyle = 'rgba(204,153,255,0.7)'; ctx.beginPath(); ctx.ellipse(-12,-5, 8,15, -Math.PI/4+flap, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.ellipse(12,-5, 8,15, Math.PI/4-flap, 0, Math.PI*2); ctx.fill(); ctx.restore(); }
        else if (this.hero.id === 'hero_SS_Crystal') { ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(gameData.frameCount*0.02); ctx.fillStyle = '#fff'; ctx.shadowBlur = 20; ctx.shadowColor = '#00ffff'; ctx.beginPath(); ctx.moveTo(0,-20); ctx.lineTo(15,0); ctx.lineTo(0,20); ctx.lineTo(-15,0); ctx.fill(); ctx.strokeStyle = 'rgba(0,255,255,0.7)'; ctx.lineWidth=2; ctx.beginPath(); for(let i=0; i<8; i++){ let a=(Math.PI/4)*i; ctx.lineTo(Math.cos(a)*25, Math.sin(a)*25); } ctx.closePath(); ctx.stroke(); ctx.restore(); }
        else if (this.hero.id === 'hero_SS_Deer') { ctx.save(); ctx.translate(this.x, this.y); ctx.fillStyle = '#00ff88'; ctx.shadowBlur = 30; ctx.shadowColor = '#00aa44'; ctx.beginPath(); ctx.arc(0, 0, this.radius, 0, Math.PI*2); ctx.fill(); ctx.strokeStyle = '#aaff00'; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-5, -15); ctx.quadraticCurveTo(-20, -30, -15, -45); ctx.moveTo(-12, -28); ctx.lineTo(-25, -25); ctx.moveTo(-15, -35); ctx.lineTo(-22, -40); ctx.moveTo(5, -15); ctx.quadraticCurveTo(20, -30, 15, -45); ctx.moveTo(12, -28); ctx.lineTo(25, -25); ctx.moveTo(15, -35); ctx.lineTo(22, -40); ctx.stroke(); ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(-6, -2, 2, 0, Math.PI*2); ctx.arc(6, -2, 2, 0, Math.PI*2); ctx.fill(); ctx.restore(); }
        else if (this.hero.id === 'hero_SSP1') { ctx.save(); ctx.translate(this.x, this.y); ctx.fillStyle = '#ffd700'; ctx.shadowBlur = 20; ctx.shadowColor = '#fff'; ctx.beginPath(); ctx.arc(0,0, this.radius, 0, Math.PI*2); ctx.fill(); ctx.fillStyle = '#fff'; ctx.fillRect(-5,-20, 10,40); ctx.fillRect(-20,-5, 40,10); ctx.restore(); }
        else if (this.hero.id === 'hero_SSP_Sukuna') { ctx.beginPath(); ctx.arc(this.x, this.y, this.radius + 5 + Math.random()*3, 0, Math.PI*2); ctx.fillStyle = 'rgba(255, 0, 0, 0.4)'; ctx.shadowBlur = 20; ctx.shadowColor = '#ff0000'; ctx.fill(); ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2); ctx.fillStyle = '#0a0000'; ctx.fill(); ctx.fillStyle = '#ff0000'; ctx.beginPath(); ctx.arc(this.x - 6, this.y - 5, 3, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(this.x + 6, this.y - 5, 3, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(this.x - 7, this.y + 4, 2, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(this.x + 7, this.y + 4, 2, 0, Math.PI*2); ctx.fill(); }
        else if (this.hero.id === 'hero_SSP_Omni') { ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(gameData.frameCount*0.05); ctx.strokeStyle = `hsl(${gameData.frameCount*5%360},100%,70%)`; ctx.lineWidth=3; ctx.shadowBlur=15; ctx.shadowColor=ctx.strokeStyle; ctx.beginPath(); ctx.ellipse(0,0, this.radius+15, this.radius, 0,0,Math.PI*2); ctx.stroke(); ctx.beginPath(); ctx.ellipse(0,0, this.radius+15, this.radius, Math.PI/2,0,Math.PI*2); ctx.stroke(); ctx.rotate(-gameData.frameCount*0.05); ctx.fillStyle='#fff'; ctx.shadowBlur=30; ctx.shadowColor='#fff'; ctx.beginPath(); ctx.arc(0,0, this.radius, 0, Math.PI*2); ctx.fill(); ctx.restore(); }
        else if (this.hero.id === 'hero_SSP_Time') { ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(gameData.frameCount*0.02); ctx.strokeStyle = '#ffcc00'; ctx.lineWidth=2; ctx.shadowBlur=10; ctx.shadowColor='#ffcc00'; ctx.beginPath(); ctx.arc(0,0, this.radius+10, 0, Math.PI*2); ctx.stroke(); for(let i=0; i<4; i++) { ctx.beginPath(); ctx.moveTo(0, -this.radius-15); ctx.lineTo(0, -this.radius-5); ctx.stroke(); ctx.rotate(Math.PI/2); } ctx.rotate(-gameData.frameCount*0.02); ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(0,0, this.radius, 0, Math.PI*2); ctx.fill(); ctx.restore(); }
        else { ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2); ctx.fillStyle = '#fff'; ctx.fill(); }

        if(this instanceof AIPlayer) { ctx.fillStyle = 'rgba(255,0,0,0.8)'; ctx.font = "bold 12px Arial"; ctx.fillText("P2 (AI)", this.x-10, this.y - this.radius - 5); }
    }
}

class AIPlayer extends Player {
    constructor(heroData) {
        super(heroData);
        this.x = width / 2 + 50; 
        this.targetX = this.x; this.targetY = this.y;
    }
    update() {
        if (this.ultState > 0 || this.isAwakeningAnim) { this.processUltimate(); return; }

        let targets = [...entities.bosses, ...entities.enemies];
        if (targets.length > 0) {
            let nearest = null; let minDist = Infinity;
            targets.forEach(e => { let d = Math.hypot(e.x - this.x, e.y - this.y); if (d < minDist) { minDist = d; nearest = e; } });

            if (nearest) {
                if (minDist > 250) { this.targetX = nearest.x; this.targetY = nearest.y; }
                else if (minDist < 150) {
                    let angle = Math.atan2(this.y - nearest.y, this.x - nearest.x);
                    this.targetX = this.x + Math.cos(angle) * 100; this.targetY = this.y + Math.sin(angle) * 100;
                } else { this.targetX = this.x; this.targetY = this.y; }
                
                this.targetX = Math.max(30, Math.min(width-30, this.targetX));
                this.targetY = Math.max(30, Math.min(height-30, this.targetY));

                if (this.rage >= this.hero.maxRage) {
                    let nearby = targets.filter(e => Math.hypot(e.x - this.x, e.y - this.y) < 300).length;
                    if (entities.bosses.length > 0 || nearby >= 3) {
                        if (this.hero.isEvent && !this.isAwakened && gameData.awakenEnemies >= 30 && gameData.awakenBosses >= 2 && (this.hero.id !== 'hero_SS_Gojo' && this.hero.id !== 'hero_SSP_Sukuna')) {
                            this.triggerAwakening();
                        } else this.triggerUltimate();
                    }
                }
            }
        }

        const dx = this.targetX - this.x; const dy = this.targetY - this.y; const dist = Math.hypot(dx, dy);
        if (dist > 5) { this.x += (dx / dist) * 4.5 * gameData.timeScale; this.y += (dy / dist) * 4.5 * gameData.timeScale; }

        this.attackTimer += gameData.timeScale;
        if (this.attackTimer >= this.hero.atkSpeed) {
            if (targets.length > 0) {
                let nearest = targets.sort((a,b) => Math.hypot(a.x - this.x, a.y - this.y) - Math.hypot(b.x - this.x, b.y - this.y))[0];
                if (Math.hypot(nearest.x - this.x, nearest.y - this.y) < 800) {
                    const angle = Math.atan2(nearest.y - this.y, nearest.x - this.x);
                    entities.projectiles.push(new Projectile(this.x, this.y, angle, this));
                    this.attackTimer = 0;
                }
            }
        }
    }
}

class Projectile {
    constructor(x, y, angle, playerInstance) {
        this.x = x; this.y = y; this.hero = playerInstance.hero; this.player = playerInstance;
        this.vx = Math.cos(angle) * this.hero.bulletSpeed; this.vy = Math.sin(angle) * this.hero.bulletSpeed;
        this.angle = angle; this.radius = (this.hero.rank === 'SS' || this.hero.rank === 'SS+') ? 8 : 4;
    }
    update() { this.x += this.vx * gameData.timeScale; this.y += this.vy * gameData.timeScale; }
    draw() {
        ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(this.angle); ctx.globalCompositeOperation = 'lighter';
        let id = this.hero.id;
        
        if (id === 'hero_SSP_Mecha') {
            ctx.rotate(gameData.frameCount * 0.5); ctx.strokeStyle = '#ff3300'; ctx.lineWidth = 2;
            ctx.beginPath(); for(let i=0; i<6; i++) { ctx.moveTo(0,0); ctx.lineTo(this.radius*1.5, 0); ctx.rotate(Math.PI/3); } ctx.stroke();
            ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0,0, this.radius, 0, Math.PI*2); ctx.fill();
            ctx.restore(); return;
        }
        if (id === 'hero_EX_Astralis') {
            if (this.player.isAwakened) {
                ctx.fillStyle = '#000'; ctx.shadowBlur = 15; ctx.shadowColor = '#ff00ff'; ctx.beginPath(); ctx.arc(0,0, this.radius+5, 0, Math.PI*2); ctx.fill(); ctx.strokeStyle = '#00ffff'; ctx.lineWidth=2; ctx.stroke();
            } else {
                ctx.fillStyle = '#ffffff'; ctx.shadowBlur = 10; ctx.shadowColor = '#00ffff'; ctx.beginPath(); ctx.moveTo(this.radius, 0); ctx.lineTo(-this.radius, this.radius*0.5); ctx.lineTo(-this.radius, -this.radius*0.5); ctx.fill();
            }
            ctx.restore(); return;
        }
        if (id === 'hero_EX_Blood') {
            if (this.player.isAwakened) {
                ctx.fillStyle = '#ff0055'; ctx.shadowBlur = 15; ctx.shadowColor = '#ff0000';
                ctx.beginPath(); ctx.moveTo(this.radius, 0); ctx.lineTo(-this.radius, this.radius*0.5); ctx.lineTo(-this.radius*0.5, 0); ctx.lineTo(-this.radius, -this.radius*0.5); ctx.fill();
            } else {
                ctx.fillStyle = '#ff0000'; ctx.shadowBlur = 10; ctx.shadowColor = '#8b0000';
                ctx.beginPath(); ctx.arc(0, 0, 6, 0, Math.PI*2); ctx.fill();
            }
            ctx.restore(); return;
        }
        if (id === 'hero_EX_Buddha') {
            if (this.player.isAwakened) { ctx.fillStyle = '#ffd700'; ctx.shadowBlur = 15; ctx.shadowColor = '#ffffff'; ctx.font="20px Arial"; ctx.fillText("卍", -10, 5); } 
            else { ctx.fillStyle = '#ffaa00'; ctx.shadowBlur = 10; ctx.shadowColor = '#ffd700'; ctx.beginPath(); ctx.arc(0, 0, 6, 0, Math.PI*2); ctx.fill(); }
            ctx.restore(); return;
        }
        if (id === 'hero_EX_Kalpa') {
            if (this.player.isAwakened) { ctx.rotate(gameData.frameCount * 0.5); ctx.fillStyle = '#00ffff'; ctx.shadowBlur = 15; ctx.shadowColor = '#ff00ff'; ctx.beginPath(); ctx.ellipse(0, 0, 20, 5, 0, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.ellipse(0, 0, 20, 5, Math.PI/2, 0, Math.PI*2); ctx.fill(); } 
            else { ctx.fillStyle = '#444'; ctx.shadowBlur = 10; ctx.shadowColor = '#fff'; ctx.beginPath(); ctx.arc(0, 0, 6, 0, Math.PI*2); ctx.fill(); }
            ctx.restore(); return;
        }

        if (id === 'hero_SS_Deer') { ctx.fillStyle = '#00ff88'; ctx.shadowBlur = 15; ctx.shadowColor = '#00aa44'; ctx.beginPath(); ctx.moveTo(10, 0); ctx.quadraticCurveTo(0, -10, -10, 0); ctx.quadraticCurveTo(0, 10, 10, 0); ctx.fill(); }
        else if (id === 'hero_A1') { ctx.fillStyle = '#00ffff'; ctx.shadowBlur=10; ctx.shadowColor='#00ffff'; ctx.fillRect(-5,-10, 15,20); }
        else if (id === 'hero_AA1') { ctx.fillStyle = '#00ff00'; ctx.shadowBlur=10; ctx.beginPath(); ctx.moveTo(10,0); ctx.lineTo(-10,-5); ctx.lineTo(-10,5); ctx.fill(); }
        else if (id === 'hero_S1') { ctx.fillStyle = '#ff6600'; ctx.shadowBlur=15; ctx.shadowColor='#ff0000'; ctx.beginPath(); ctx.arc(0,0, 6, 0, Math.PI*2); ctx.fill(); ctx.fillRect(-10,-4, 10,8); }
        else if (id === 'hero_SS1') { ctx.rotate(gameData.frameCount*0.3); ctx.fillStyle='#8a2be2'; ctx.shadowBlur=15; ctx.beginPath(); ctx.moveTo(0,0); ctx.quadraticCurveTo(15,-15, 0,-25); ctx.quadraticCurveTo(-10,-15, 0,0); ctx.fill(); ctx.beginPath(); ctx.moveTo(0,0); ctx.quadraticCurveTo(-15,15, 0,25); ctx.quadraticCurveTo(10,15, 0,0); ctx.fill(); }
        else if (id === 'hero_SS_Gojo') { ctx.fillStyle='#8a2be2'; ctx.shadowBlur=20; ctx.shadowColor='#ff00ff'; ctx.beginPath(); ctx.arc(0,0, 10, 0, Math.PI*2); ctx.fill(); let t=gameData.frameCount*0.2; ctx.fillStyle='#ff0000'; ctx.beginPath(); ctx.arc(Math.cos(t)*10, Math.sin(t)*10, 4, 0, Math.PI*2); ctx.fill(); ctx.fillStyle='#00bfff'; ctx.beginPath(); ctx.arc(Math.cos(t+Math.PI)*10, Math.sin(t+Math.PI)*10, 4, 0, Math.PI*2); ctx.fill(); }
        else if (id === 'hero_SS_Cosmic') { ctx.fillStyle='#fff'; ctx.shadowBlur=15; ctx.shadowColor='#ff00ff'; ctx.beginPath(); ctx.arc(0,0, 6, 0, Math.PI*2); ctx.fill(); let t=gameData.frameCount*0.3; ctx.fillStyle='#00ffff'; ctx.beginPath(); ctx.arc(Math.cos(t)*8, Math.sin(t)*8, 3, 0, Math.PI*2); ctx.fill(); ctx.fillStyle='#ff00ff'; ctx.beginPath(); ctx.arc(Math.cos(t+Math.PI)*8, Math.sin(t+Math.PI)*8, 3, 0, Math.PI*2); ctx.fill(); }
        else if (id === 'hero_SS_Mythic') { ctx.fillStyle='#fff'; ctx.shadowBlur=15; ctx.shadowColor='#ffd700'; ctx.beginPath(); ctx.moveTo(20,0); ctx.lineTo(-10,6); ctx.lineTo(-5,0); ctx.lineTo(-10,-6); ctx.fill(); }
        else if (id === 'hero_SS_Dragon') { ctx.fillStyle='#00ffff'; ctx.shadowBlur=20; ctx.shadowColor='#0044ff'; ctx.beginPath(); ctx.arc(0,0, 8, Math.PI/2, -Math.PI/2); ctx.lineTo(24,0); ctx.fill(); }
        else if (id === 'hero_SS_Lily') { ctx.rotate(gameData.frameCount*0.2); ctx.fillStyle='#ff0055'; ctx.shadowBlur=15; ctx.shadowColor='#ff0000'; ctx.beginPath(); ctx.ellipse(0,5, 4,12, 0,0,Math.PI*2); ctx.ellipse(0,-5, 4,12, 0,0,Math.PI*2); ctx.fill(); }
        else if (id === 'hero_SS_Fox') { ctx.fillStyle='#ff66cc'; ctx.shadowBlur=15; ctx.shadowColor='#9933ff'; ctx.beginPath(); ctx.arc(0,0, 6, 0, Math.PI*2); ctx.fill(); ctx.fillStyle='#9933ff'; ctx.beginPath(); ctx.moveTo(0,-6); ctx.lineTo(-15,0); ctx.lineTo(0,6); ctx.fill(); }
        else if (id === 'hero_SS_Butterfly') { ctx.fillStyle='#fff'; ctx.shadowBlur=15; ctx.shadowColor='#cc99ff'; ctx.beginPath(); ctx.arc(0,0, 8, Math.PI/2, -Math.PI/2); ctx.lineTo(16,0); ctx.fill(); }
        else if (id === 'hero_SS_Crystal') { ctx.rotate(Math.PI/4); ctx.fillStyle='#fff'; ctx.shadowBlur=15; ctx.shadowColor='#00ffff'; ctx.fillRect(-5,-5, 10,10); }
        else if (id === 'hero_SSP1') { ctx.fillStyle='#ffd700'; ctx.shadowBlur=20; ctx.shadowColor='#fff'; ctx.fillRect(-5,-10, 10,20); ctx.fillRect(-10,-5, 20,10); }
        else if (id === 'hero_SSP_Sukuna') { ctx.strokeStyle='#ff0000'; ctx.lineWidth=4; ctx.shadowBlur=15; ctx.shadowColor='#8b0000'; ctx.beginPath(); ctx.arc(0,0, 20, -Math.PI/3, Math.PI/3); ctx.stroke(); }
        else if (id === 'hero_SSP_Omni') { ctx.rotate(gameData.frameCount*0.2); ctx.fillStyle='#fff'; ctx.shadowBlur=20; ctx.shadowColor=`hsl(${gameData.frameCount*5%360},100%,50%)`; ctx.beginPath(); ctx.moveTo(0,-10); ctx.lineTo(5,-5); ctx.lineTo(10,0); ctx.lineTo(5,5); ctx.lineTo(0,10); ctx.lineTo(-5,5); ctx.lineTo(-10,0); ctx.lineTo(-5,-5); ctx.fill(); }
        else if (id === 'hero_SSP_Time') { ctx.fillStyle='#fff'; ctx.shadowBlur=15; ctx.shadowColor='#ffcc00'; ctx.beginPath(); ctx.moveTo(this.radius*2,0); ctx.lineTo(-this.radius,this.radius*0.5); ctx.lineTo(-this.radius,-this.radius*0.5); ctx.fill(); }
        else { ctx.beginPath(); ctx.arc(0,0, 4, 0, Math.PI*2); ctx.fillStyle = '#fff'; ctx.fill(); }
        ctx.restore();
    }
}

class Enemy {
    constructor() {
        if (Math.random() < 0.5) { this.x = Math.random()<0.5?-30:width+30; this.y = Math.random()*height; } 
        else { this.x = Math.random()*width; this.y = Math.random()<0.5?-30:height+30; }
        this.radius = 12; this.speed = Math.random() * 1.5 + 1;
        let hpMultiplier = isDualMode ? 1.5 : 1; 
        this.maxHp = (50 + (gameData.currentBossLevel * 10)) * hpMultiplier; 
        this.hp = this.maxHp; 
    }
    update() {
        let target = playerObj;
        if(player2Obj) {
            let d1 = Math.hypot(playerObj.x - this.x, playerObj.y - this.y);
            let d2 = Math.hypot(player2Obj.x - this.x, player2Obj.y - this.y);
            if(d2 < d1) target = player2Obj;
        }
        if(!target) return;

        const angle = Math.atan2(target.y - this.y, target.x - this.x);
        this.x += Math.cos(angle) * this.speed * gameData.timeScale; this.y += Math.sin(angle) * this.speed * gameData.timeScale;
        
        [playerObj, player2Obj].forEach(p => {
            if (p && !p.isDead && Math.hypot(p.x - this.x, p.y - this.y) < p.radius + this.radius) { 
                p.hp -= 0.5; gameData.screenShake = 2; if(p.hp <= 0) p.isDead = true; 
            }
        });
    }
    draw() {
        ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        ctx.fillStyle = '#ff0055'; ctx.shadowBlur = 5; ctx.shadowColor = '#ff0000'; ctx.fill();
        if (this.hp < this.maxHp) { ctx.fillStyle = 'red'; ctx.fillRect(this.x - 10, this.y - 20, 20, 4); ctx.fillStyle = 'green'; ctx.fillRect(this.x - 10, this.y - 20, 20 * (this.hp/this.maxHp), 4); }
    }
}

class Boss extends Enemy {
    constructor(level) {
        super(); this.level = level; this.radius = 40 + (level * 2); 
        let hpMultiplier = isDualMode ? 1.5 : 1;
        this.maxHp = (1000 * level * (level * 0.8)) * hpMultiplier; 
        this.hp = this.maxHp;
        this.speed = 1.2; this.color = level % 2 === 0 ? '#ff3300' : '#ff00ff';
        document.getElementById('boss-ui').style.display = 'block'; document.getElementById('boss-name').innerText = `ÁC QUỶ VỰC SÂU (Cấp ${level})`;
    }
    update() {
        super.update();
        [playerObj, player2Obj].forEach(p => {
            if (p && !p.isDead && Math.hypot(p.x - this.x, p.y - this.y) < p.radius + this.radius) { p.hp -= 2; if(p.hp <= 0) p.isDead = true; }
        });
        document.getElementById('boss-hp-bar').style.width = Math.max(0, (this.hp / this.maxHp) * 100) + '%';
    }
    draw() {
        ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(gameData.frameCount * 0.02 * gameData.timeScale);
        ctx.beginPath(); const spikes = 8;
        for(let i=0; i<spikes*2; i++) { const r = i%2===0 ? this.radius : this.radius*0.5; const a = (Math.PI*2 / (spikes*2)) * i; ctx.lineTo(Math.cos(a)*r, Math.sin(a)*r); }
        ctx.closePath(); ctx.fillStyle = this.color; ctx.shadowBlur = 30; ctx.shadowColor = this.color; ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
    }
}

class FloatingText {
    constructor(x, y, text, color, size=16) { this.x = x; this.y = y; this.text = text; this.color = color; this.size = size; this.life = 1; }
    update() { this.y -= 1 * (gameData.timeScale === 0 ? 1 : gameData.timeScale); this.life -= 0.02 * (gameData.timeScale === 0 ? 1 : gameData.timeScale); }
    draw() { ctx.globalAlpha = Math.max(0, this.life); ctx.font = `bold ${this.size}px Arial`; ctx.fillStyle = this.color; ctx.fillText(this.text, this.x, this.y); ctx.globalAlpha = 1; }
}

function drawEnvironmentEffects() {
    entities.envEffects.forEach((eff) => {
        let t = eff.timer; let maxT = eff.maxT; let cx = width/2, cy = height/2;
        ctx.save(); ctx.globalCompositeOperation = 'lighter';

        if (eff.type === 'blood_awaken') {
            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = `rgba(50, 0, 10, ${Math.min(0.9, t/50)})`; ctx.fillRect(0,0,width,height);
            ctx.translate(cx, cy); 
            ctx.globalCompositeOperation = 'lighter';
            ctx.fillStyle = `rgba(255, 0, 85, ${t/240})`; ctx.beginPath(); ctx.arc(0,0, 150, 0, Math.PI*2); ctx.fill();
            
            if(t > 150) { 
                ctx.strokeStyle = '#ff0055'; ctx.lineWidth = 5; ctx.lineCap = 'round';
                for(let i=0; i<15; i++) { ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo((Math.random()-0.5)*width, (Math.random()-0.5)*height); ctx.stroke(); }
            }
            if(t > 230) { ctx.fillStyle='#ff0000'; ctx.fillRect(-cx, -cy, width, height); }
        }
        else if (eff.type === 'blood_awakened') {
            let p1 = 210, p2 = 420;
            ctx.globalCompositeOperation = 'source-over';
            if (t < p1) {
                ctx.fillStyle = `rgba(20, 0, 0, ${t/p1})`; ctx.fillRect(0,0,width,height);
                ctx.fillStyle = '#ff0000'; ctx.shadowBlur = 50; ctx.shadowColor = '#ff0055';
                ctx.beginPath(); ctx.arc(cx, cy, (t/p1)*250, 0, Math.PI*2); ctx.fill();
                
                ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = '#ff0055'; ctx.lineWidth = 2;
                for(let i=0; i<15; i++) { ctx.beginPath(); ctx.moveTo(Math.random()*width, Math.random()*height); ctx.lineTo(cx, cy); ctx.stroke(); }
            } else if (t < p2) {
                ctx.fillStyle = '#110000'; ctx.fillRect(0,0,width,height);
                ctx.globalCompositeOperation = 'lighter';
                ctx.fillStyle = '#ff0000'; ctx.beginPath(); ctx.arc(cx, cy, 250 + (t-p1)*10, 0, Math.PI*2); ctx.fill();
                
                ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 15;
                for(let i=0; i<30; i++) {
                    let angle = (Math.PI*2/30)*i + t*0.02;
                    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(angle)*width, cy + Math.sin(angle)*height); ctx.stroke();
                }
                
                let alpha = 1 - (t-p1)/(p2-p1);
                ctx.fillStyle = `rgba(255, 0, 85, ${alpha})`; ctx.fillRect(0,0,width,height);
            }
        }
        else if (eff.type === 'blood_normal') {
            ctx.globalCompositeOperation = 'source-over';
            let q1=60, q2=120, q3=180, q4=240, q5=300;
            if (t < q1) { ctx.fillStyle = `rgba(30, 0, 0, ${t/q1})`; ctx.fillRect(0,0,width,height); }
            else if (t < q2) { ctx.fillStyle='#220000'; ctx.fillRect(0,0,width,height); ctx.translate(cx,cy); ctx.fillStyle='#ff0000'; ctx.beginPath(); ctx.arc(0, 0, (t-q1)*2, 0, Math.PI*2); ctx.fill(); }
            else if (t < q3) { ctx.fillStyle='#220000'; ctx.fillRect(0,0,width,height); ctx.translate(cx,cy); ctx.fillStyle='#000'; ctx.beginPath(); ctx.arc(0, -50 + (t-q2), 100, 0, Math.PI*2); ctx.fill(); }
            else if (t < q4) { ctx.fillStyle='#ff0000'; ctx.fillRect(0,0,width,height); ctx.globalCompositeOperation='lighter'; ctx.fillStyle='#fff'; for(let i=0; i<50; i++) { ctx.fillRect(Math.random()*width, Math.random()*height, Math.random()*100, 2); } }
            else { ctx.fillStyle=`rgba(255,0,85,${1 - (t-q4)/60})`; ctx.fillRect(0,0,width,height); }
        }
        else if (eff.type === 'mecha_obliteration') {
            ctx.globalCompositeOperation = 'source-over';
            if (t < 100) {
                ctx.fillStyle = `rgba(10, 0, 0, ${t/100})`; ctx.fillRect(0,0,width,height);
                ctx.strokeStyle = `rgba(255, 50, 0, ${t/100})`; ctx.lineWidth = 2; ctx.translate(cx, cy); ctx.rotate(t * 0.02);
                ctx.beginPath(); ctx.arc(0,0, 300 - t, 0, Math.PI*2); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(-400, 0); ctx.lineTo(400, 0); ctx.moveTo(0, -400); ctx.lineTo(0, 400); ctx.stroke();
            } 
            else if (t < 200) {
                ctx.fillStyle = 'rgba(10, 0, 0, 1)'; ctx.fillRect(0,0,width,height);
                ctx.fillStyle = '#111'; ctx.strokeStyle = '#ff3300'; ctx.lineWidth = 5; let cannonY = -300 + (t-100)*3;
                ctx.fillRect(cx - 150, cannonY, 300, 200); ctx.strokeRect(cx - 150, cannonY, 300, 200);
                ctx.fillStyle = '#fff'; ctx.shadowBlur = 50; ctx.shadowColor = '#ff0000'; ctx.beginPath(); ctx.arc(cx, cannonY + 200, (t-100)*0.5, 0, Math.PI*2); ctx.fill();
            } 
            else if (t < 280) {
                ctx.fillStyle = (t%2===0) ? '#ff3300' : '#ffffff'; ctx.fillRect(0,0,width,height);
                ctx.fillStyle = '#000'; ctx.globalCompositeOperation = 'destination-out'; ctx.fillRect(cx - 200 + Math.random()*20, 0, 400, height);
            } 
            else { ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = `rgba(255, 50, 0, ${1 - (t-280)/20})`; ctx.fillRect(0,0,width,height); }
        }
        else if (eff.type === 'buddha_awaken') {
            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = `rgba(50, 30, 0, ${Math.min(0.9, t/50)})`; ctx.fillRect(0,0,width,height);
            ctx.translate(cx, cy); 
            ctx.globalCompositeOperation = 'lighter';
            ctx.fillStyle = `rgba(255, 215, 0, ${t/240})`; ctx.beginPath(); ctx.arc(0,0, 200, 0, Math.PI*2); ctx.fill();
            
            if(t > 150) { 
                ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 20; ctx.lineCap = 'round';
                for(let i=0; i<12; i++) { ctx.rotate(Math.PI*2/12); ctx.beginPath(); ctx.moveTo(0,0); ctx.quadraticCurveTo(150, 100, 300, 0); ctx.stroke(); }
            }
            if(t > 230) { ctx.fillStyle='#fff'; ctx.fillRect(-cx, -cy, width, height); }
        }
        else if (eff.type === 'buddha_awakened') {
            ctx.globalCompositeOperation = 'source-over'; let ph1=60, ph2=120, ph3=180, ph4=240, ph5=300, ph6=360, ph7=420;

            if (t < ph1) { ctx.fillStyle = `rgba(255, 215, 0, ${t/ph1})`; ctx.fillRect(0,0,width,height); }
            else if (t < ph2) { 
                ctx.fillStyle = '#ffaa00'; ctx.fillRect(0,0,width,height); ctx.translate(cx, cy); ctx.rotate(t*0.02); ctx.globalCompositeOperation = 'lighter';
                ctx.strokeStyle='#fff'; ctx.lineWidth=20; ctx.beginPath(); ctx.arc(0,0,300,0,Math.PI*2); ctx.stroke();
                for(let i=0; i<8; i++){ ctx.rotate(Math.PI*2/8); ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(300,0); ctx.stroke(); }
            }
            else if (t < ph3) { 
                ctx.fillStyle = '#ffaa00'; ctx.fillRect(0,0,width,height); ctx.globalCompositeOperation='lighter'; ctx.fillStyle='#ffd700'; ctx.shadowBlur=20; ctx.shadowColor='#fff';
                Math.seedrandom=9; for(let i=0; i<30; i++) { let px = Math.sin(i*12)*width; let py = Math.cos(i*34)*height; ctx.beginPath(); ctx.ellipse(px, py, 40, 80, Math.sin(i), 0, Math.PI*2); ctx.fill(); }
            }
            else if (t < ph4) { 
                ctx.fillStyle = '#ffaa00'; ctx.fillRect(0,0,width,height); ctx.globalCompositeOperation='lighter'; ctx.fillStyle='#fff';
                Math.seedrandom=9; for(let i=0; i<30; i++) { let px = Math.sin(i*12)*width; let py = Math.cos(i*34)*height; ctx.beginPath(); ctx.arc(px, py, (t-ph3)*5, 0, Math.PI*2); ctx.fill(); }
            }
            else if (t < ph5) { 
                ctx.fillStyle = '#ffd700'; ctx.fillRect(0,0,width,height); ctx.translate(cx,cy); ctx.rotate(t*0.1); ctx.strokeStyle = '#fff'; ctx.lineWidth=50;
                ctx.beginPath(); ctx.moveTo(-200,0); ctx.lineTo(200,0); ctx.moveTo(0,-200); ctx.lineTo(0,200); ctx.moveTo(-200,-200); ctx.lineTo(-200,0); ctx.moveTo(200,200); ctx.lineTo(200,0); ctx.moveTo(-200,200); ctx.lineTo(0,200); ctx.moveTo(200,-200); ctx.lineTo(0,-200); ctx.stroke();
            }
            else if (t < ph6) { ctx.fillStyle='#fff'; ctx.fillRect(0,0,width,height); }
            else { ctx.fillStyle = `rgba(255,255,255,${1 - (t-ph6)/60})`; ctx.fillRect(0,0,width,height); }
        }
        else if (eff.type === 'buddha_normal') {
            ctx.globalCompositeOperation = 'source-over'; let q1=60, q2=120, q3=180, q4=240, q5=300;
            if (t < q1) { ctx.fillStyle = `rgba(50, 30, 0, ${t/q1})`; ctx.fillRect(0,0,width,height); }
            else if (t < q2) { ctx.fillStyle='#331a00'; ctx.fillRect(0,0,width,height); ctx.translate(cx,cy); ctx.fillStyle='#ffd700'; for(let i=0; i<8; i++){ ctx.rotate(Math.PI*2/8); ctx.beginPath(); ctx.ellipse(0, (t-q1)*2, 20, 60, 0, 0, Math.PI*2); ctx.fill(); } }
            else if (t < q3) { ctx.fillStyle='#331a00'; ctx.fillRect(0,0,width,height); ctx.translate(cx,cy); ctx.rotate(t*0.05); ctx.fillStyle='#fff'; for(let i=0; i<108; i++) { ctx.rotate(Math.PI*2/108); ctx.beginPath(); ctx.arc(300, 0, 5, 0, Math.PI*2); ctx.fill(); } }
            else if (t < q4) { ctx.fillStyle='#331a00'; ctx.fillRect(0,0,width,height); ctx.fillStyle='#ffd700'; ctx.fillRect(cx-200, cy-300, 400, (t-q3)*10); }
            else { ctx.fillStyle=`rgba(255,215,0,${1 - (t-q4)/60})`; ctx.fillRect(0,0,width,height); }
        }
        else if (eff.type === 'astralis_awaken') {
            ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = `rgba(0, 0, 0, ${Math.min(0.9, t/50)})`; ctx.fillRect(0,0,width,height); ctx.translate(cx, cy); let pulse = Math.sin(t*0.2)*20; ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255, 255, 255, ${t/240})`; ctx.beginPath(); ctx.arc(0,0, 100+pulse, 0, Math.PI*2); ctx.fill();
            if(t > 180) { ctx.strokeStyle = '#00ffff'; ctx.lineWidth = 10; for(let i=0; i<15; i++) { ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo((Math.random()-0.5)*width, (Math.random()-0.5)*height); ctx.stroke(); } }
            if(t > 230) { ctx.fillStyle='#ff00ff'; ctx.fillRect(-cx, -cy, width, height); }
        }
        else if (eff.type === 'astralis_awakened') {
            ctx.globalCompositeOperation = 'source-over'; let ph1=60, ph2=120, ph3=180, ph4=240, ph5=300, ph6=360, ph7=420;
            if (t < ph1) { ctx.fillStyle = `rgba(0, 0, 0, ${t/ph1})`; ctx.fillRect(0,0,width,height); ctx.fillStyle = '#00ffff'; ctx.shadowBlur=20; ctx.shadowColor='#ff00ff'; for(let i=0; i<50; i++) { ctx.beginPath(); ctx.arc(Math.random()*width, Math.random()*height, Math.random()*3, 0, Math.PI*2); ctx.fill(); } }
            else if (t < ph2) { ctx.fillStyle = '#000'; ctx.fillRect(0,0,width,height); ctx.translate(cx, cy-200); ctx.fillStyle='#ff00ff'; ctx.shadowBlur=50; ctx.shadowColor='#00ffff'; ctx.beginPath(); ctx.ellipse(0,0, 300, 100, 0,0,Math.PI*2); ctx.fill(); ctx.fillStyle='#000'; ctx.beginPath(); ctx.arc(0,0, 50, 0,Math.PI*2); ctx.fill(); }
            else if (t < ph3) { ctx.fillStyle = '#000'; ctx.fillRect(0,0,width,height); ctx.globalCompositeOperation='lighter'; ctx.translate(cx, cy); let r = (t-ph2)*5; for(let i=1; i<5; i++) { ctx.strokeStyle=`rgba(0,255,255,${1/i})`; ctx.lineWidth=5; ctx.beginPath(); ctx.arc(0,0, r*i, 0, Math.PI*2); ctx.stroke(); } }
            else if (t < ph4) { ctx.fillStyle = '#000'; ctx.fillRect(0,0,width,height); ctx.globalCompositeOperation='lighter'; ctx.translate(cx, cy); let r = 300 - (t-ph3)*5; ctx.fillStyle='#ff00ff'; ctx.beginPath(); ctx.arc(0,0, Math.max(0,r), 0, Math.PI*2); ctx.fill(); ctx.strokeStyle='#00ffff'; ctx.lineWidth=5; for(let i=0; i<20; i++) { ctx.beginPath(); ctx.moveTo(Math.random()*width-cx, Math.random()*height-cy); ctx.lineTo(0,0); ctx.stroke(); } }
            else if (t < ph5) { ctx.fillStyle = (t%2===0)?'#00ffff':'#ff00ff'; ctx.fillRect(0,0,width,height); }
            else if (t < ph6) { ctx.fillStyle='#000'; ctx.fillRect(0,0,width,height); ctx.globalCompositeOperation='lighter'; let h = (t-ph5)*20; ctx.fillStyle='#fff'; ctx.fillRect(0, cy-h/2, width, h); ctx.fillRect(cx-h/2, 0, h, height); }
            else { ctx.fillStyle = `rgba(255,255,255,${1 - (t-ph6)/60})`; ctx.fillRect(0,0,width,height); }
        }
        else if (eff.type === 'astralis_normal') {
            ctx.globalCompositeOperation = 'source-over'; let q1=60, q2=120, q3=180, q4=240, q5=300;
            if (t < q1) { ctx.fillStyle = `rgba(0, 0, 20, ${t/q1})`; ctx.fillRect(0,0,width,height); }
            else if (t < q2) { ctx.fillStyle='#000014'; ctx.fillRect(0,0,width,height); ctx.strokeStyle='#ffd700'; ctx.lineWidth=2; for(let i=0; i<30; i++) { ctx.beginPath(); ctx.moveTo(Math.random()*width, Math.random()*height); ctx.lineTo(Math.random()*width, Math.random()*height); ctx.stroke(); } }
            else if (t < q3) { ctx.fillStyle='#000014'; ctx.fillRect(0,0,width,height); ctx.translate(cx,cy); let r=(t-q2)*4; ctx.fillStyle='#ffd700'; ctx.shadowBlur=50; ctx.shadowColor='#fff'; ctx.beginPath(); ctx.arc(0,0,r,0,Math.PI*2); ctx.fill(); }
            else if (t < q4) { ctx.fillStyle='#000014'; ctx.fillRect(0,0,width,height); ctx.globalCompositeOperation='lighter'; ctx.translate(cx,cy); ctx.fillStyle='#ffd700'; ctx.beginPath(); ctx.arc(0,0,240,0,Math.PI*2); ctx.fill(); ctx.fillStyle='#fff'; ctx.fillRect(-width, -50, width*2, 100); }
            else { ctx.fillStyle=`rgba(255,255,255,${1 - (t-q4)/60})`; ctx.fillRect(0,0,width,height); }
        }
        else if (eff.type === 'kalpa_awaken') {
            ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = `rgba(0, 0, 0, ${Math.min(0.9, t/50)})`; ctx.fillRect(0,0,width,height); ctx.translate(cx, cy); let pulse = Math.sin(t*0.2)*20; ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255, 255, 255, ${t/300})`; ctx.beginPath(); ctx.arc(0,0, 100+pulse, 0, Math.PI*2); ctx.fill();
            if(t > 250) { ctx.strokeStyle = '#00ffff'; ctx.lineWidth = 10; for(let i=0; i<10; i++) { ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo((Math.random()-0.5)*width, (Math.random()-0.5)*height); ctx.stroke(); } }
            if(t > 290) { ctx.fillStyle='#fff'; ctx.fillRect(-cx, -cy, width, height); }
        }
        else if (eff.type === 'kalpa_awakened') {
            ctx.globalCompositeOperation = 'source-over'; let ph1=51, ph2=102, ph3=153, ph4=204, ph5=255, ph6=306, ph7=360;
            if (t < ph1) { ctx.fillStyle = `rgba(0, 0, 0, ${t/ph1})`; ctx.fillRect(0,0,width,height); ctx.strokeStyle='#fff'; ctx.lineWidth=5; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx+300, cy-400); ctx.moveTo(cx, cy); ctx.lineTo(cx-400, cy+200); ctx.stroke(); }
            else if (t < ph2) { ctx.fillStyle = '#000'; ctx.fillRect(0,0,width,height); ctx.translate(cx, cy-200); ctx.fillStyle='#fff'; ctx.shadowBlur=50; ctx.shadowColor='#00ffcc'; ctx.beginPath(); ctx.ellipse(0,0, 300, 100, 0,0,Math.PI*2); ctx.fill(); ctx.fillStyle='#000'; ctx.beginPath(); ctx.arc(0,0, 50, 0,Math.PI*2); ctx.fill(); }
            else if (t < ph3) { ctx.fillStyle = '#000'; ctx.fillRect(0,0,width,height); ctx.globalCompositeOperation='lighter'; ctx.strokeStyle='#ff00ff'; ctx.lineWidth=10; for(let i=0; i<10; i++) { let px = Math.random()*width; let py = (t-ph2)*20 + Math.random()*200; ctx.beginPath(); ctx.moveTo(px, py-100); ctx.lineTo(px-50, py); ctx.stroke(); } }
            else if (t < ph4) { ctx.fillStyle = '#000'; ctx.fillRect(0,0,width,height); ctx.globalCompositeOperation='lighter'; ctx.translate(cx, cy); let r = (t-ph3)*10; ctx.fillStyle='#00ffff'; ctx.beginPath(); ctx.arc(0,0, r, 0, Math.PI*2); ctx.fill(); }
            else if (t < ph5) { ctx.fillStyle = '#fff'; ctx.fillRect(0,0,width,height); ctx.filter = 'invert(1)'; ctx.translate(cx, cy); ctx.fillStyle='#000'; ctx.beginPath(); ctx.arc(0,0, 500, 0, Math.PI*2); ctx.fill(); }
            else if (t < ph6) { let grad = ctx.createLinearGradient(0,0,width,height); grad.addColorStop(0,'#00ffff'); grad.addColorStop(0.5,'#fff'); grad.addColorStop(1,'#ff00ff'); ctx.fillStyle = grad; ctx.fillRect(0,0,width,height); }
            else { ctx.fillStyle = `rgba(255,255,255,${1 - (t-ph6)/54})`; ctx.fillRect(0,0,width,height); }
        }
        else if (eff.type === 'kalpa_normal') {
            ctx.globalCompositeOperation = 'source-over'; let q1=60, q2=120, q3=180, q4=240, q5=300;
            if (t < q1) { ctx.fillStyle = `rgba(50, 50, 50, ${t/q1})`; ctx.fillRect(0,0,width,height); }
            else if (t < q2) { ctx.fillStyle='#333'; ctx.fillRect(0,0,width,height); ctx.translate(cx,cy); ctx.fillStyle='#000'; ctx.beginPath(); ctx.arc(0,0, (t-q1)*2, 0, Math.PI*2); ctx.fill(); }
            else if (t < q3) { ctx.fillStyle='#333'; ctx.fillRect(0,0,width,height); ctx.translate(cx,cy); ctx.strokeStyle='#fff'; ctx.lineWidth=5; ctx.beginPath(); ctx.arc(0,0, (t-q2)*10, 0, Math.PI*2); ctx.stroke(); }
            else if (t < q4) { ctx.fillStyle='#333'; ctx.fillRect(0,0,width,height); ctx.fillStyle='#fff'; ctx.fillRect(0, cy-100, width, 200); }
            else { ctx.fillStyle=`rgba(255,255,255,${1 - (t-q4)/60})`; ctx.fillRect(0,0,width,height); }
        }
        else {
            let p1=30, p2=60, p3=90, p4=120, p5=150, p6=180;
            if(maxT === 90) { p1=15; p2=30; p3=45; p4=60; p5=75; } 
            if(maxT === 300) { p1=50; p2=100; p3=150; p4=200; p5=250; } 

            if (eff.type === 'crystal_mirage') { 
                if (t < p1) { ctx.translate(eff.x, eff.y); ctx.rotate(t*0.2); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(0, -t*2); ctx.lineTo(t*2, 0); ctx.lineTo(0, t*2); ctx.lineTo(-t*2, 0); ctx.fill(); } 
                else if (t < p2) { ctx.translate(cx, cy); ctx.rotate((t-p1)*0.05); let scale = (t-p1)*40; ctx.strokeStyle = '#00ffff'; ctx.lineWidth = 4; ctx.beginPath(); for(let i=0; i<6; i++) { ctx.rotate(Math.PI*2/6); ctx.moveTo(0,0); ctx.lineTo(0,scale); ctx.lineTo(scale*0.2, scale*0.8); ctx.moveTo(0,scale); ctx.lineTo(-scale*0.2, scale*0.8); } ctx.stroke(); } 
                else if (t < p3) { ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = 'rgba(0,20,40,0.8)'; ctx.fillRect(0,0,width,height); ctx.globalCompositeOperation = 'lighter'; for(let i=0; i<15; i++) { let h = Math.min((t-p2)*20, height); ctx.fillStyle=`hsla(180, 100%, 70%, 0.8)`; ctx.fillRect((width/15)*i, height-h+Math.sin(i)*100, width/20, h); } }
                else if (t < p4) { for(let i=0; i<15; i++) { ctx.beginPath(); ctx.moveTo(cx + (i%2===0?-width:width), cy + Math.sin(i*10)*height); ctx.lineTo(cx + Math.cos(t*0.1+i)*width, cy + Math.sin(t*0.1+i)*height); ctx.lineTo(cx, cy + (i%3===0?-height:height)); ctx.fillStyle = `hsla(${(t*5+i*20)%360}, 100%, 60%, 0.5)`; ctx.fill(); } let grad = ctx.createLinearGradient(0, cy-200, 0, cy+200); grad.addColorStop(0, 'transparent'); grad.addColorStop(0.5, '#fff'); grad.addColorStop(1, 'transparent'); ctx.fillStyle = grad; ctx.fillRect(0, cy-200, width, 400); } 
                else { ctx.fillStyle = `rgba(200, 255, 255, ${1 - (t-p4)/(maxT-p4)})`; ctx.fillRect(0,0,width,height); }
            }
            else if (eff.type === 'lunar_butterfly') { 
                if (t < p1) { ctx.fillStyle = `rgba(5, 0, 20, ${t/p1})`; ctx.fillRect(0,0,width,height); ctx.beginPath(); ctx.arc(cx, cy-100, 300, 0, Math.PI*2); ctx.fillStyle='#cc99ff'; ctx.fill(); ctx.beginPath(); ctx.arc(cx+300-(t/p1)*300, cy-100, 290, 0, Math.PI*2); ctx.fillStyle='#050014'; ctx.fill(); }
                else if (t < p2) { ctx.fillStyle='rgba(5,0,20,0.9)'; ctx.fillRect(0,0,width,height); for(let i=0; i<50; i++) { ctx.fillStyle='#cc99ff'; ctx.beginPath(); ctx.arc(Math.sin(i*12)*width, height-(t-p1)*15+Math.cos(i*34)*100, 4, 0, Math.PI*2); ctx.fill(); } }
                else if (t < p3) { ctx.translate(cx, cy); let flap = Math.abs(Math.cos(t*0.1)); ctx.fillStyle = 'rgba(204, 153, 255, 0.7)'; ctx.save(); ctx.scale(0.5+flap*0.5, 1); ctx.beginPath(); ctx.moveTo(0,0); ctx.bezierCurveTo(200, -400, 600, -200, 800, -600); ctx.bezierCurveTo(500, 0, 700, 400, 0, 200); ctx.fill(); ctx.restore(); ctx.save(); ctx.scale(-0.5-flap*0.5, 1); ctx.beginPath(); ctx.moveTo(0,0); ctx.bezierCurveTo(200, -400, 600, -200, 800, -600); ctx.bezierCurveTo(500, 0, 700, 400, 0, 200); ctx.fill(); ctx.restore(); }
                else if (t < p4) { let w = width; ctx.fillStyle=`rgba(204,153,255,1)`; ctx.fillRect(0,0,w,height); ctx.beginPath(); ctx.arc(cx, cy, (t-p3)*40, 0, Math.PI*2); ctx.strokeStyle='#fff'; ctx.lineWidth=20; ctx.stroke(); }
                else { ctx.fillStyle = `rgba(255, 255, 255, ${1 - (t-p4)/(maxT-p4)})`; ctx.fillRect(0,0,width,height); }
            }
            else if (eff.type === 'nine_tails') { 
                if (t < p1) { ctx.fillStyle = `rgba(20, 0, 10, ${t/p1})`; ctx.fillRect(0,0,width,height); }
                else if (t < p2) { ctx.fillStyle='rgba(20,0,10,0.9)'; ctx.fillRect(0,0,width,height); let grad=ctx.createRadialGradient(cx, cy-200, 0, cx, cy-200, 400); grad.addColorStop(0,'#fff'); grad.addColorStop(0.3,'#ff66cc'); grad.addColorStop(1,'transparent'); ctx.fillStyle=grad; ctx.beginPath(); ctx.arc(cx,cy-200,400,0,Math.PI*2); ctx.fill(); }
                else if (t < p3) { ctx.fillStyle='#1a001a'; ctx.fillRect(0,0,width,height); ctx.translate(cx, cy+200); ctx.fillStyle='rgba(255, 102, 204, 0.8)'; ctx.beginPath(); ctx.moveTo(0,0); ctx.quadraticCurveTo(-200, -200, -250, -400); ctx.lineTo(-100,-300); ctx.quadraticCurveTo(0,-200,100,-300); ctx.lineTo(250,-400); ctx.quadraticCurveTo(200,-200,0,0); ctx.fill(); ctx.fillStyle='#fff'; ctx.beginPath(); ctx.ellipse(-80,-200,50,15,Math.PI/6,0,Math.PI*2); ctx.ellipse(80,-200,50,15,-Math.PI/6,0,Math.PI*2); ctx.fill(); }
                else if (t < p4) { let grad = ctx.createLinearGradient(0,0,width,height); grad.addColorStop(0,'#ff99cc'); grad.addColorStop(0.5,'#ff3399'); grad.addColorStop(1,'#cc00ff'); ctx.fillStyle=grad; ctx.fillRect(0,0,width,height); ctx.strokeStyle='#fff'; ctx.lineWidth=5; for(let i=0; i<10; i++){ ctx.beginPath(); ctx.arc(cx,cy,(t-p3)*20+i*50,0,Math.PI*2); ctx.stroke(); } }
                else { ctx.fillStyle = `rgba(255, 102, 204, ${1 - (t-p4)/(maxT-p4)})`; ctx.fillRect(0,0,width,height); }
            }
            else if (eff.type === 'samsara_lily') { 
                ctx.globalCompositeOperation = 'source-over';
                if (t < p1) { ctx.fillStyle = `rgba(20, 0, 0, ${t/p1})`; ctx.fillRect(0,0,width,height); let moonY = cy-100+(p1-t)*2; ctx.fillStyle='#ff0000'; ctx.beginPath(); ctx.arc(cx, moonY, 300, 0, Math.PI*2); ctx.fill(); }
                else if (t < p2) { ctx.fillStyle='rgba(20,0,0,0.9)'; ctx.fillRect(0,0,width,height); ctx.fillStyle='#ff0000'; ctx.beginPath(); ctx.arc(cx,cy-100,300,0,Math.PI*2); ctx.fill(); let grad=ctx.createLinearGradient(0,height,0,height-300); grad.addColorStop(0,'rgba(255,0,50,0.8)'); grad.addColorStop(1,'transparent'); ctx.fillStyle=grad; ctx.fillRect(0,height-300,width,300); ctx.strokeStyle='#ff0055'; ctx.lineWidth=2; for(let i=0; i<20; i++){ let fx=(width/20)*i; let fy=height-50; ctx.beginPath(); ctx.moveTo(fx,fy); ctx.lineTo(fx, fy-(t-p1)*5); ctx.stroke(); } }
                else if (t < p3) { ctx.fillStyle='#110000'; ctx.fillRect(0,0,width,height); ctx.fillStyle='#ff0000'; ctx.beginPath(); ctx.arc(cx,cy-100,300,0,Math.PI*2); ctx.fill(); ctx.strokeStyle='rgba(255,0,0,0.8)'; ctx.lineWidth=4; eff.targets.forEach(e => { ctx.beginPath(); ctx.moveTo(cx, cy-100); ctx.bezierCurveTo(cx, cy, e.x, e.y-100, e.x, e.y); ctx.stroke(); }); }
                else if (t < p4) { ctx.globalCompositeOperation='lighter'; ctx.fillStyle='rgba(255,0,50,1)'; ctx.fillRect(0,0,width,height); ctx.strokeStyle='#fff'; ctx.lineWidth=5; for(let i=0; i<10; i++) { ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx+(Math.random()-0.5)*1000, cy+(Math.random()-0.5)*1000); ctx.stroke(); } }
                else { ctx.globalCompositeOperation='lighter'; ctx.fillStyle = `rgba(255, 0, 50, ${1 - (t-p4)/(maxT-p4)})`; ctx.fillRect(0,0,width,height); }
            }
            else if (eff.type === 'azure_dragon') { 
                if (t < p1) { ctx.translate(cx, cy); ctx.rotate(t*0.05); ctx.strokeStyle=`rgba(0,255,255,${t/p1})`; ctx.lineWidth=10; ctx.beginPath(); ctx.arc(0,0,300,0,Math.PI*2); ctx.stroke(); }
                else if (t < p2) { ctx.fillStyle='rgba(0,10,40,0.8)'; ctx.fillRect(0,0,width,height); ctx.translate(cx, cy); ctx.rotate(t*0.05); ctx.strokeStyle='#00ffff'; ctx.lineWidth=4; ctx.beginPath(); for(let i=0;i<8;i++){ let a=(Math.PI*2/8)*i; ctx.lineTo(Math.cos(a)*300, Math.sin(a)*300); } ctx.closePath(); ctx.stroke(); }
                else if (t < p3) { ctx.fillStyle='rgba(0,10,40,0.9)'; ctx.fillRect(0,0,width,height); let startY=height+100-(t-p2)*20; ctx.strokeStyle='rgba(0,200,255,0.9)'; ctx.lineWidth=80; ctx.lineCap='round'; ctx.beginPath(); for(let i=0; i<15; i++){ let py=startY+i*60; let px=cx+Math.sin((t-p2)*0.1+i*0.5)*200; if(i===0) ctx.moveTo(px,py); else ctx.lineTo(px,py); } ctx.stroke(); let headX=cx+Math.sin((t-p2)*0.1)*200; ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(headX,startY,50,0,Math.PI*2); ctx.fill(); }
                else if (t < p4) { ctx.fillStyle='rgba(0,200,255,1)'; ctx.fillRect(0,0,width,height); ctx.strokeStyle='#fff'; ctx.lineWidth=10; for(let i=0; i<15; i++) { ctx.beginPath(); ctx.moveTo(0, Math.random()*height); ctx.lineTo(width, Math.random()*height); ctx.stroke(); } }
                else { ctx.fillStyle = `rgba(0, 255, 255, ${1 - (t-p4)/(maxT-p4)})`; ctx.fillRect(0,0,width,height); }
            }
            else if (eff.type === 'mythic_genesis') { 
                if (t < p1) { let alpha=t/p1; let grad=ctx.createLinearGradient(0,0,0,height); grad.addColorStop(0,`rgba(255,255,255,${alpha})`); grad.addColorStop(1,`rgba(255,215,0,${alpha*0.5})`); ctx.fillStyle=grad; ctx.fillRect(0,0,width,height); }
                else if (t < p2) { ctx.fillStyle='rgba(255,255,255,0.8)'; ctx.fillRect(0,0,width,height); for(let i=0; i<50; i++) { ctx.fillStyle='#fff'; ctx.beginPath(); ctx.ellipse(Math.random()*width, (t-p1)*10+Math.random()*height, 8,3,Math.random(),0,Math.PI*2); ctx.fill(); } }
                else if (t < p3) { ctx.fillStyle='rgba(255,255,255,1)'; ctx.fillRect(0,0,width,height); ctx.strokeStyle='rgba(255,215,0,0.8)'; ctx.lineWidth=20; for(let i=0; i<5; i++){ let rx=Math.random()*width; ctx.beginPath(); ctx.moveTo(rx,0); ctx.lineTo(rx-200,height); ctx.stroke(); } }
                else if (t < p4) { ctx.fillStyle='rgba(255,255,255,1)'; ctx.fillRect(0,0,width,height); ctx.translate(cx,cy); let size=(t-p3)*50; ctx.fillStyle='rgba(255,215,0,0.9)'; ctx.fillRect(-size,-30,size*2,60); ctx.fillRect(-30,-size,60,size*2); ctx.fillStyle='#fff'; ctx.fillRect(-size,-10,size*2,20); ctx.fillRect(-10,-size,20,size*2); }
                else { ctx.fillStyle = `rgba(255, 255, 255, ${1 - (t-p4)/(maxT-p4)})`; ctx.fillRect(0,0,width,height); }
            }
            else if (eff.type === 'big_bang') { 
                if (t < p1) { ctx.translate(eff.x, eff.y); ctx.rotate(t*0.05); ctx.strokeStyle='#00ffff'; ctx.lineWidth=5; ctx.setLineDash([30,20]); ctx.beginPath(); ctx.arc(0,0,t*15,0,Math.PI*2); ctx.stroke(); }
                else if (t < p2) { ctx.fillStyle='rgba(0,0,0,0.8)'; ctx.fillRect(0,0,width,height); for(let i=0; i<100; i++) { ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(Math.random()*width, Math.random()*height, Math.random()*2, 0, Math.PI*2); ctx.fill(); } }
                else if (t < p3) { ctx.translate(cx, cy); ctx.rotate(t*0.2); let r=Math.min((t-p2)*10, 600); let grad=ctx.createRadialGradient(0,0,0,0,0,r); grad.addColorStop(0,'#fff'); grad.addColorStop(0.2,'#00ffff'); grad.addColorStop(1,'transparent'); ctx.fillStyle=grad; ctx.beginPath(); ctx.arc(0,0,r,0,Math.PI*2); ctx.fill(); for(let i=0; i<4; i++){ ctx.rotate(Math.PI/2); ctx.fillStyle='rgba(255,0,255,0.3)'; ctx.beginPath(); ctx.ellipse(r*0.3,0,r*0.4,r*0.1,0,0,Math.PI*2); ctx.fill(); } }
                else if (t < p4) { ctx.fillStyle='#fff'; ctx.fillRect(0,0,width,height); ctx.fillStyle='rgba(255,0,255,0.5)'; ctx.fillRect(0,0,width,height); }
                else { let alpha=1-(t-p4)/(maxT-p4); ctx.fillStyle=`rgba(255,255,255,${alpha})`; ctx.fillRect(0,0,width,height); ctx.fillStyle=`rgba(255,0,255,${alpha*0.5})`; ctx.fillRect(0,0,width,height); }
            }
            else if (eff.type === 'malevolent_shrine') { 
                ctx.globalCompositeOperation = 'source-over';
                if (t < p1) { ctx.fillStyle = `rgba(50, 0, 0, ${t/p1})`; ctx.fillRect(0,0,width,height); }
                else if (t < p2) { ctx.fillStyle='#110000'; ctx.fillRect(0,0,width,height); ctx.fillStyle='#000'; ctx.fillRect(cx-150,cy-100,300,200); ctx.fillStyle='#8b0000'; ctx.fillRect(cx-180,cy-120,360,40); }
                else if (t < p3) { ctx.fillStyle='#110000'; ctx.fillRect(0,0,width,height); ctx.fillStyle='#000'; ctx.fillRect(cx-150,cy-100,300,200); ctx.fillStyle='#8b0000'; ctx.fillRect(cx-180,cy-120,360,40); ctx.globalCompositeOperation='lighter'; ctx.strokeStyle='#ff0000'; ctx.lineWidth=5; for(let i=0; i<5; i++) { ctx.save(); ctx.translate(Math.random()*width, Math.random()*height); ctx.rotate(Math.random()*Math.PI); ctx.beginPath(); ctx.moveTo(-200,0); ctx.lineTo(200,0); ctx.stroke(); ctx.restore(); } }
                else if (t < p4) { ctx.globalCompositeOperation='lighter'; ctx.fillStyle='#ff3300'; ctx.fillRect(0,0,width,height); ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(cx,cy, (t-p3)*50, 0, Math.PI*2); ctx.fill(); }
                else { ctx.globalCompositeOperation='lighter'; ctx.fillStyle = `rgba(255, 69, 0, ${1 - (t-p4)/(maxT-p4)})`; ctx.fillRect(0,0,width,height); }
            }
            else if (eff.type === 'infinite_void') { 
                ctx.globalCompositeOperation = 'source-over';
                if (t < p1) { ctx.beginPath(); ctx.arc(eff.x, eff.y, t*50, 0, Math.PI*2); ctx.fillStyle='#050505'; ctx.fill(); ctx.strokeStyle='#00bfff'; ctx.lineWidth=5; ctx.stroke(); }
                else if (t < p2) { ctx.fillStyle='#000'; ctx.fillRect(0,0,width,height); let pulse=1+Math.sin(t*0.1)*0.1; let grad=ctx.createRadialGradient(cx,cy,0,cx,cy,400*pulse); grad.addColorStop(0,'#fff'); grad.addColorStop(0.1,'#00bfff'); grad.addColorStop(0.5,'#8a2be2'); grad.addColorStop(1,'transparent'); ctx.globalCompositeOperation='lighter'; ctx.fillStyle=grad; ctx.beginPath(); ctx.arc(cx,cy,500,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(cx,cy,80,0,Math.PI*2); ctx.fillStyle='#000'; ctx.shadowBlur=50; ctx.shadowColor='#fff'; ctx.fill(); }
                else if (t < p3) { ctx.fillStyle='#000'; ctx.fillRect(0,0,width,height); ctx.globalCompositeOperation='lighter'; ctx.strokeStyle=`rgba(0,255,255,0.8)`; ctx.lineWidth=2; for(let i=0; i<30; i++) { ctx.beginPath(); ctx.moveTo(0, Math.random()*height); ctx.lineTo(width, Math.random()*height); ctx.stroke(); } }
                else if (t < p4) { ctx.fillStyle='#fff'; ctx.fillRect(0,0,width,height); ctx.strokeStyle='#00ffff'; ctx.lineWidth=10; ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx+500,cy-500); ctx.moveTo(cx,cy); ctx.lineTo(cx-500,cy+500); ctx.stroke(); }
                else { ctx.fillStyle = `rgba(255, 255, 255, ${1 - (t-p4)/(maxT-p4)})`; ctx.fillRect(0,0,width,height); }
            }
            else if (eff.type === 'shadow_demon') { 
                ctx.globalCompositeOperation = 'source-over';
                if (t < p1) { ctx.fillStyle = `rgba(10, 0, 20, ${t/p1})`; ctx.fillRect(0,0,width,height); }
                else if (t < p2) { ctx.fillStyle='rgba(10,0,20,1)'; ctx.fillRect(0,0,width,height); ctx.fillStyle='#ff0000'; ctx.shadowBlur=50; ctx.shadowColor='#ff0000'; let eyeSize=(t-p1)*2; ctx.beginPath(); ctx.ellipse(cx-100,cy-200,eyeSize*2,eyeSize,Math.PI/8,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.ellipse(cx+100,cy-200,eyeSize*2,eyeSize,-Math.PI/8,0,Math.PI*2); ctx.fill(); }
                else if (t < p3) { ctx.fillStyle='rgba(10,0,20,1)'; ctx.fillRect(0,0,width,height); ctx.strokeStyle='#ff0000'; ctx.lineWidth=20; ctx.beginPath(); ctx.moveTo(cx-200, height); ctx.lineTo(cx-100, cy); ctx.stroke(); ctx.beginPath(); ctx.moveTo(cx+200, height); ctx.lineTo(cx+100, cy); ctx.stroke(); }
                else if (t < p4) { ctx.globalCompositeOperation='lighter'; ctx.fillStyle='#8a2be2'; ctx.fillRect(0,0,width,height); ctx.fillStyle='#fff'; ctx.fillRect(0,cy-100,width,200); }
                else { ctx.fillStyle = `rgba(138, 43, 226, ${1 - (t-p4)/(maxT-p4)})`; ctx.fillRect(0,0,width,height); }
            }
            else if (eff.type === 'omni_genesis') {
                if (t < p1) { ctx.fillStyle = `rgba(0, 0, 0, ${t/p1})`; ctx.fillRect(0,0,width,height); ctx.translate(eff.x, eff.y-30); ctx.rotate(t*0.02); ctx.globalCompositeOperation='lighter'; for(let i=1; i<=6; i++) { ctx.beginPath(); ctx.arc(0,0, t*i*3, 0, Math.PI*2); ctx.strokeStyle = `hsl(${t*2+i*30}, 100%, 70%)`; ctx.lineWidth = 3; ctx.setLineDash([15*i, 20]); ctx.stroke(); } } 
                else if (t < p2) { ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = '#000'; ctx.fillRect(0,0,width,height); ctx.globalCompositeOperation = 'lighter'; ctx.lineWidth = 8; ctx.strokeStyle = `hsl(${t*15%360}, 100%, 70%)`; for(let i=0; i<8; i++) { ctx.beginPath(); ctx.moveTo(cx, cy); let angle = (Math.PI*2/8)*i + Math.sin(t*0.1); let lx=cx, ly=cy; for(let j=0; j<5; j++) { lx += Math.cos(angle)*150; ly += Math.sin(angle)*150; angle += (Math.random()-0.5)*1.5; ctx.lineTo(lx, ly); } ctx.stroke(); } } 
                else if (t < p3) { ctx.fillStyle = '#000'; ctx.fillRect(0,0,width,height); ctx.globalCompositeOperation = 'lighter'; ctx.beginPath(); ctx.arc(cx, cy, (t-p2)*20, 0, Math.PI*2); ctx.fillStyle='#fff'; ctx.fill(); }
                else if (t < p4) { ctx.translate(cx, cy); ctx.rotate(t*0.01); let r = width; ctx.globalCompositeOperation = 'lighter'; for(let i=0; i<12; i++) { ctx.rotate(Math.PI*2/12); ctx.beginPath(); ctx.ellipse(r*0.5, 0, r*0.6, r*0.1, 0, 0, Math.PI*2); ctx.fillStyle = `rgba(255, 255, 255, 0.8)`; ctx.fill(); ctx.strokeStyle=`hsl(${t*10%360},100%,70%)`; ctx.lineWidth=5; ctx.stroke(); } }
                else { ctx.fillStyle = `rgba(255, 255, 255, ${1 - (t-p4)/(maxT-p4)})`; ctx.fillRect(0,0,width,height); }
            }
            else if (eff.type === 'time_paradox') {
                if (t < p1) { ctx.fillStyle = `rgba(30, 20, 5, ${t/p1})`; ctx.fillRect(0,0,width,height); ctx.filter = `sepia(${t*2}%)`; }
                else if (t < p2) { ctx.filter = 'sepia(100%) hue-rotate(-30deg)'; ctx.fillStyle = 'rgba(20, 10, 0, 0.9)'; ctx.fillRect(0,0,width,height); ctx.translate(cx, cy); ctx.rotate(-t * 0.05); ctx.strokeStyle = 'rgba(255, 204, 0, 0.5)'; ctx.lineWidth = 15; ctx.beginPath(); ctx.arc(0, 0, 400, 0, Math.PI*2); ctx.stroke(); for(let i=0; i<12; i++) { ctx.rotate(Math.PI*2/12); ctx.beginPath(); ctx.moveTo(400, -20); ctx.lineTo(440, -10); ctx.lineTo(440, 10); ctx.lineTo(400, 20); ctx.fillStyle = 'rgba(255, 204, 0, 0.5)'; ctx.fill(); } }
                else if (t < p3) { ctx.fillStyle = '#000000'; ctx.fillRect(0,0,width,height); ctx.translate(cx, cy); let r = (t-p2)*6; let grad = ctx.createRadialGradient(0,0,0, 0,0,r); grad.addColorStop(0, '#ffffff'); grad.addColorStop(0.2, '#ffcc00'); grad.addColorStop(1, 'transparent'); ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI*2); ctx.fill(); ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(0, 0, r*0.8, 0, Math.PI*2); ctx.stroke(); for(let i=0; i<12; i++) { ctx.rotate(Math.PI*2/12); ctx.beginPath(); ctx.moveTo(r*0.7, 0); ctx.lineTo(r*0.8, 0); ctx.stroke(); } }
                else if (t < p4) { ctx.fillStyle = '#000000'; ctx.fillRect(0,0,width,height); ctx.translate(cx, cy); ctx.strokeStyle = '#ffcc00'; ctx.lineWidth = 8; for(let i=0; i<24; i++) { ctx.rotate(Math.PI*2/24 + (t*0.01)); ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(width, 0); ctx.stroke(); } }
                else { ctx.fillStyle = `rgba(255, 255, 255, ${1 - (t-p4)/(maxT-p4)})`; ctx.fillRect(0,0,width,height); }
            }
            else if (eff.type === 'shockwave' || eff.type === 'fireblast') { 
                if (t < p2) { ctx.fillStyle=`rgba(255,255,255,${t/p2})`; ctx.fillRect(0,0,width,height); }
                else if (t < p4) { ctx.fillStyle='#fff'; ctx.fillRect(0,0,width,height); }
                else { ctx.fillStyle=`rgba(255,255,255,${1-(t-p4)/(maxT-p4)})`; ctx.fillRect(0,0,width,height); }
            }
        }
        
        ctx.restore();
    });
}

function gameLoop() {
    if (!isPlaying) return;
    requestAnimationFrame(gameLoop);
    
    if (isPaused) return;

    gameData.frameCount++;

    ctx.filter = 'none'; 
    ctx.fillStyle = 'rgba(5, 5, 10, 0.4)'; 
    ctx.fillRect(0, 0, width, height);

    drawEnvironmentEffects();

    ctx.save();
    if (gameData.screenShake > 0) {
        ctx.translate((Math.random()-.5)*gameData.screenShake, (Math.random()-.5)*gameData.screenShake);
        gameData.screenShake *= 0.9;
    }

    if (gameData.score >= gameData.nextBossScore) {
        gameData.currentBossLevel++;
        entities.bosses.push(new Boss(gameData.currentBossLevel));
        gameData.nextBossScore += 10;
        document.getElementById('next-boss-val').innerText = gameData.nextBossScore;
        
        gameData.awakenBosses++;
        entities.enemies = []; 
    }

    if (entities.bosses.length === 0 && gameData.frameCount % Math.max(10, 50 - gameData.score) === 0) {
        entities.enemies.push(new Enemy());
    }
    
    if (playerObj && (playerObj.hero.id === 'hero_EX_Kalpa' || playerObj.hero.id === 'hero_EX_Buddha' || playerObj.hero.id === 'hero_EX_Blood')) {
        let progress = (Math.min(30, gameData.awakenEnemies)/30 * 50) + (Math.min(2, gameData.awakenBosses)/2 * 50);
        document.getElementById('awaken-bar').style.width = `${progress}%`;
        if(progress >= 100 && !playerObj.isAwakened) document.getElementById('awaken-hint').style.display = 'block';
    }

    entities.floatingTexts = entities.floatingTexts.filter(t => { t.update(); t.draw(); return t.life > 0; });
    
    entities.projectiles = entities.projectiles.filter(p => {
        p.update(); p.draw();
        if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) return false;
        
        let hit = false;
        let targets = [...entities.bosses, ...entities.enemies];
        
        for (let e of targets) {
            if (Math.hypot(p.x - e.x, p.y - e.y) < p.radius + e.radius) {
                let baseDmg = p.hero.ultDmg * 0.05; 
                if (p.player.isAwakened) baseDmg *= 5; // Awaken atk = x5
                const finalDmg = Math.max(10, Math.round(baseDmg * p.player.damageMultiplier));
                
                e.hp -= finalDmg; hit = true;
                entities.floatingTexts.push(new FloatingText(e.x, e.y, finalDmg.toString(), "white"));
                if (p.player.ultState === 0 && !p.player.isAwakeningAnim) p.player.rage = Math.min(p.player.rage + 5, p.player.hero.maxRage);
                break;
            }
        }
        return !hit;
    });

    entities.bosses = entities.bosses.filter(b => {
        b.update(); b.draw();
        if (b.hp <= 0) {
            entities.floatingTexts.push(new FloatingText(b.x, b.y, "BOSS TIÊU DIỆT!", "#ffd700", 40));
            document.getElementById('boss-ui').style.display = 'none';
            gameData.score += 5; document.getElementById('score-val').innerText = gameData.score;
            if(gameData.score % 50 === 0) saveData(); 
            return false;
        }
        return true;
    });

    entities.enemies = entities.enemies.filter(e => {
        e.update(); e.draw();
        if (e.hp <= 0) {
            gameData.score++; document.getElementById('score-val').innerText = gameData.score;
            gameData.awakenEnemies++;
            return false;
        }
        return true;
    });

    if(playerObj && !playerObj.isDead) { playerObj.update(); playerObj.draw(); }
    if(player2Obj && !player2Obj.isDead) { player2Obj.update(); player2Obj.draw(); }

    ctx.restore();
}

// KHỞI CHẠY (Luôn đưa Màn hình đăng nhập lên đầu)
document.getElementById('auth-modal').style.display = 'flex';