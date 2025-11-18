document.addEventListener('DOMContentLoaded', () => {
    const petTypeInput = document.getElementById('petType');
    const petNameInput = document.getElementById('petName');
    const birthdateInput = document.getElementById('birthdate');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultBox = document.getElementById('result-box');
    
    // 新增：獲取 body 元素
    const body = document.body;
    
    // 定義背景圖片 URL
    const DOG_BG_URL = '../image/dog.png';
    const CAT_BG_URL = '../image/cat.jpeg'; 

const TODAY = new Date();
    
    // =========================================================
    // 【新增功能 1】: 數據儲存 (localStorage)
    // 當輸入變更時，自動儲存數據
    // =========================================================
    function saveData() {
        try {
            localStorage.setItem('petName', petNameInput.value.trim());
            localStorage.setItem('petBirthdate', birthdateInput.value);
            localStorage.setItem('petType', petTypeInput.value);
        } catch (e) {
            console.error("無法使用 localStorage 儲存數據:", e);
        }
    }

    // =========================================================
    // 【新增功能 2】: 數據加載與自動計算 (localStorage)
    // 頁面載入時執行
    // =========================================================
    function loadDataAndCalculate() {
        try {
            const savedName = localStorage.getItem('petName');
            const savedBirthdate = localStorage.getItem('petBirthdate');
            const savedType = localStorage.getItem('petType');

            // 1. 加載數據
            if (savedName !== null) petNameInput.value = savedName;
            if (savedBirthdate !== null) birthdateInput.value = savedBirthdate;
            if (savedType !== null) petTypeInput.value = savedType;

            // 2. 設定背景 (根據加載的類型)
            updateBackground(petTypeInput.value); 

            // 3. 自動計算 (如果有儲存過有效數據)
            if (savedName && savedBirthdate) {
                // 使用 setTimeout 確保 DOM 渲染完成後再計算，避免影響載入速度
                setTimeout(calculatePetAge, 50); 
            } else {
                // 如果沒有儲存數據，確保初始背景正確
                updateBackground(petTypeInput.value); 
            }
        } catch (e) {
            console.error("無法從 localStorage 加載數據:", e);
            updateBackground(petTypeInput.value); 
        }
    }
    
    // --- 事件監聽器 (包含儲存功能) ---
    petTypeInput.addEventListener('change', (event) => {
        updateBackground(event.target.value);
        saveData(); 
        calculatePetAge(); // 類型變更後也重新計算
    });

    petNameInput.addEventListener('input', saveData); 
    birthdateInput.addEventListener('change', () => {
        saveData();
        calculatePetAge(); // 日期變更後也重新計算
    }); 
    calculateBtn.addEventListener('click', calculatePetAge);

    // 頁面載入時執行數據加載與自動計算
    loadDataAndCalculate(); 

    // --- 背景切換邏輯 (保持不變) ---
    function updateBackground(petType) {
        if (petType === 'dog') {
            body.style.backgroundImage = `url('${DOG_BG_URL}')`;
        } else if (petType === 'cat') {
            body.style.backgroundImage = `url('${CAT_BG_URL}')`;
        }
    }

    // --- 年齡計算核心邏輯 (保持不變) ---
    function calculateHumanAge(ageInYears) {
        let humanAge = 0;
        
        if (ageInYears >= 2) {
            humanAge = 24;
            const remainingPetYears = ageInYears - 2;
            humanAge += remainingPetYears * 4;
        } else if (ageInYears >= 1) {
            humanAge = 15;
            const remainingPetYears = ageInYears - 1;
            humanAge += remainingPetYears * 9; 
        } else {
            humanAge = ageInYears * 15;
        }
        
        return humanAge;
    }

    // --- 計算並顯示寵物的年齡 (保持不變) ---
    function calculatePetAge() {
        const petName = petNameInput.value.trim() || '您的寵物';
        const petType = petTypeInput.value; 
        const birthdateStr = birthdateInput.value;
        let petTypeDisplay = '';
        let formulaText = '';

        if (!birthdateStr) {
            resultBox.innerHTML = '<p style="color: red;">請選擇寵物的出生日期！</p>';
            return;
        }

        const birthDate = new Date(birthdateStr);
        
        if (birthDate > TODAY) {
            resultBox.innerHTML = '<p style="color: red;">出生日期不能晚於今天！</p>';
            return;
        }

        const ageInMilliseconds = TODAY - birthDate;
        const ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);
        const petYears = ageInYears.toFixed(2);
        
        const humanAge = calculateHumanAge(ageInYears);
        const humanAgeRounded = humanAge.toFixed(1); 
        
        if (petType === 'dog') {
            petTypeDisplay = '狗齡';
            formulaText = '狗齡換算依據：1歲=15人歲, 2歲=24人歲, 之後每年+4人歲。 (此為通用公式，大型犬換算速率略有不同)';
        } else { // cat
            petTypeDisplay = '貓齡';
            formulaText = '貓齡換算依據：1歲=15人歲, 2歲=24人歲, 之後每年+4人歲。';
        }

        resultBox.innerHTML = `
            <p><strong>實際${petTypeDisplay}：</strong> ${petName} 現在大約是 <strong>${petYears}</strong> 歲。</p>
            <p><strong>換算人齡：</strong> 換算成人類的年齡大概是 <strong>${humanAgeRounded}</strong> 歲。</p>
            <p style="margin-top: 10px; font-size: 0.9em;">(${formulaText})</p>
        `;
    }
});