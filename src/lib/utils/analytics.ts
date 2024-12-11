export function initializeGoogleAnalytics(nonce: string) {
    // Create a nonce-based inline script for gtag initialization
    const inlineScript = document.createElement('script');
    inlineScript.setAttribute('nonce', nonce);
    inlineScript.textContent = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-M91P9505Z1', {
            anonymize_ip: true
        });
    `;
    document.head.appendChild(inlineScript);

    // Create the external Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=G-M91P9505Z1`;
    script.setAttribute('nonce', nonce);
    document.head.appendChild(script);
}

export function initializeWeChatMetaTags(metadata: any, nonce: string) {
    const wechatMetaTags = [
        { name: 'description', content: metadata.description.zh },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: metadata.title.zh },
        { property: 'og:description', content: metadata.description.zh },
        { property: 'og:image', content: `${metadata.url}${metadata.images.wechat}` },
        { name: 'weixin:type', content: 'webpage' },
        { name: 'weixin:title', content: metadata.title.zh },
        { name: 'weixin:description', content: metadata.description.zh },
        { name: 'weixin:image', content: `${metadata.url}${metadata.images.wechat}` }
    ];

    wechatMetaTags.forEach(tag => {
        const metaTag = document.createElement('meta');
        Object.entries(tag).forEach(([key, value]) => {
            metaTag.setAttribute(key, value);
        });
        metaTag.setAttribute('data-dynamic', 'true');
        document.head.appendChild(metaTag);
    });

    const wxScript = document.createElement('script');
    wxScript.src = 'https://res.wx.qq.com/open/js/jweixin-1.6.0.js';
    wxScript.async = true;
    wxScript.setAttribute('nonce', nonce);
    document.head.appendChild(wxScript);
}