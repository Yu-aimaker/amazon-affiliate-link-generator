document.addEventListener('DOMContentLoaded', () => {
    // テーマ管理の初期化
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeToggle.checked = savedTheme === 'dark';

    // テーマ切り替えイベントの設定
    themeToggle.addEventListener('change', () => {
        const newTheme = themeToggle.checked ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // 要素の取得
    const affiliateUrlInput = document.getElementById('affiliateUrl');
    const copyBtn = document.getElementById('copyBtn');
    const copyHtmlBtn = document.getElementById('copyHtmlBtn');
    const messageDiv = document.getElementById('message');
    const imagePreview = document.getElementById('imagePreview');
    const htmlOutput = document.getElementById('htmlOutput');

    /**
     * メッセージを表示する
     * @param {string} message - 表示するメッセージ
     * @param {boolean} isSuccess - 成功メッセージかどうか
     */
    const showMessage = (message, isSuccess = true) => {
        messageDiv.textContent = message;
        messageDiv.className = `message ${isSuccess ? 'success' : 'error'}`;
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 3000);
    };

    /**
     * 画像をプレビュー表示する
     * @param {string} imageUrl - 画像URL
     */
    const displayImagePreview = (imageUrl) => {
        imagePreview.innerHTML = '';
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = '商品画像プレビュー';
        imagePreview.appendChild(img);
    };

    // URLパラメータからデータを取得
    const params = new URLSearchParams(window.location.search);
    const affiliateLink = params.get('affiliateLink');
    const imageUrl = params.get('imageUrl');
    const html = params.get('html');

    if (!affiliateLink || !imageUrl || !html) {
        showMessage('URLパラメータが不正です', false);
        return;
    }

    // データを表示
    affiliateUrlInput.value = affiliateLink;
    displayImagePreview(imageUrl);
    htmlOutput.value = html;

    // コピーボタンのクリックイベント
    copyBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(affiliateLink);
            showMessage('リンクをクリップボードにコピーしました');
        } catch (error) {
            showMessage('コピーに失敗しました', false);
        }
    });

    // HTMLコピーボタンのクリックイベント
    copyHtmlBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(html);
            showMessage('HTMLをクリップボードにコピーしました');
        } catch (error) {
            showMessage('コピーに失敗しました', false);
        }
    });
});