document.addEventListener('DOMContentLoaded', () => {
    const petTypeInput = document.getElementById('petType');
    const petNameInput = document.getElementById('petName');
    const birthdateInput = document.getElementById('birthdate');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultBox = document.getElementById('result-box');
    
    const body = document.body;
    
    // 背景圖片 URL
    const DOG_BG_URL = '/image/dog.png';
    const CAT_BG_URL = '/image/cat.jpeg'; 

    const TODAY = new Date();
    
    calculateBtn.addEventListener('click', calculatePetAge);

    // --- 背景切換邏輯 ---
    
    /**
     * 根據寵物類型切換背景圖片
     */
    function updateBackground(petType) {
        if (petType === 'dog') {
            body.style.backgroundImage = `url('${DOG_BG_URL}')`;
        } else if (petType === 'cat') {
            body.style.backgroundImage = `url('${CAT_BG_URL}')`;
        }
    }
    
    // 1. 頁面載入時，設定初始背景
    updateBackground(petTypeInput.value); 

    // 2. 監聽寵物類型選擇的變化事件
    petTypeInput.addEventListener('change', (event) => {
        updateBackground(event.target.value);
    });

    // --- 年齡計算核心邏輯 ---

    /**
     * 核心計算函數：將寵物齡換算為人類年齡 (15-9-4 規則)
     */
    function calculateHumanAge(ageInYears) {
        let humanAge = 0;
        
        if (ageInYears >= 2) {
            // 2歲及以上: 前兩年 24 歲 + 之後每年 4 歲
            humanAge = 24;
            const remainingPetYears = ageInYears - 2;
            humanAge += remainingPetYears * 4;
        } else if (ageInYears >= 1) {
            // 1歲到 2歲之間: 1歲 15 歲 + 剩餘年數 * 9 歲
            humanAge = 15;
            const remainingPetYears = ageInYears - 1;
            humanAge += remainingPetYears * 9; 
        } else {
            // 1歲以內: 實際寵物齡 * 15 歲
            humanAge = ageInYears * 15;
        }
        
        return humanAge;
    }

    /**
     * 計算並顯示寵物的年齡
     */
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