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
    const amazonUrlInput = document.getElementById('amazonUrl');
    const convertBtn = document.getElementById('convertBtn');
    const messageDiv = document.getElementById('message');

    // Amazon画像URLベース
    const IMAGE_BASE_URL = 'https://images-fe.ssl-images-amazon.com/images/P/';

    /**
     * URLからASINコードを抽出する
     * @param {string} url - Amazon商品URL
     * @returns {string|null} - ASINコード、または無効な場合はnull
     */
    const extractAsin = (url) => {
        try {
            const urlObj = new URL(url);
            if (!urlObj.hostname.includes('amazon.co.jp')) {
                throw new Error('Amazon.co.jpのURLではありません');
            }

            // /dp/XXXXXXXXXX/ パターンのチェック
            const dpMatch = url.match(/\/dp\/([A-Z0-9]{10})/);
            if (dpMatch) {
                return dpMatch[1];
            }

            // /gp/product/XXXXXXXXXX パターンのチェック
            const gpMatch = url.match(/\/gp\/product\/([A-Z0-9]{10})/);
            if (gpMatch) {
                return gpMatch[1];
            }

            throw new Error('有効なASINコードが見つかりませんでした');
        } catch (error) {
            showMessage(error.message, false);
            return null;
        }
    };

    /**
     * アフィリエイトリンクを生成する
     * @param {string} asin - ASINコード
     * @returns {string} - アフィリエイトリンク
     */
    const generateAffiliateLink = (asin, trackingId) => {
        return `https://www.amazon.co.jp/dp/${asin}/ref=nosim?tag=${trackingId}`;
    };

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
     * 商品画像URLを生成する
     * @param {string} asin - ASINコード
     * @returns {string} - 商品画像URL
     */
    const generateImageUrl = (asin) => {
        return `${IMAGE_BASE_URL}${asin}.01.LZZZZZZZ.jpg`;
    };

    /**
     * HTML形式の出力を生成する
     * @param {string} imageUrl - 商品画像URL
     * @param {string} affiliateLink - アフィリエイトリンク
     * @returns {string} - HTML形式の出力
     */
    const generateHtmlOutput = (imageUrl, affiliateLink) => {
        return `<a href="${affiliateLink}" target="_blank" rel="nofollow">
    <img src="${imageUrl}" alt="商品画像" style="max-width: 100%; height: auto;">
</a>`;
    };

    // 変換ボタンのクリックイベント
    convertBtn.addEventListener('click', () => {
        const amazonUrl = amazonUrlInput.value.trim();
        const trackingId = document.getElementById('trackingId').value.trim();

        if (!amazonUrl) {
            showMessage('URLを入力してください', false);
            return;
        }

        if (!trackingId) {
            showMessage('トラッキングIDを入力してください', false);
            return;
        }

        if (!trackingId.match(/^[a-z0-9]+-[0-9]{2}$/)) {
            showMessage('トラッキングIDの形式が正しくありません（例: your-id-20）', false);
            return;
        }

        const asin = extractAsin(amazonUrl);
        if (asin) {
            const affiliateLink = generateAffiliateLink(asin, trackingId);
            const imageUrl = generateImageUrl(asin);
            const html = generateHtmlOutput(imageUrl, affiliateLink);

            // リダイレクト用のパラメータを作成
            const params = new URLSearchParams({
                affiliateLink,
                imageUrl,
                html
            });
            // result.htmlにリダイレクト
            window.location.href = `result.html?${params.toString()}`;
        }
    });

    // Enterキーでの変換
    amazonUrlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            convertBtn.click();
        }
    });
});