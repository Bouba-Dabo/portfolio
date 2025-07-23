// Test Script pour les fonctionnalités i18n
// Copiez ce code dans la console du navigateur pour tester

console.log("🌍 Test des fonctionnalités i18n");

// 1. Test changement de langue
function testLanguageSwitch() {
    console.log("1️⃣ Test changement de langue...");
    
    const currentLang = window.portfolioI18n?.getCurrentLanguage() || 'fr';
    console.log(`Langue actuelle: ${currentLang}`);
    
    // Simuler clic sur le sélecteur
    const languageToggle = document.getElementById('language-toggle');
    if (languageToggle) {
        console.log("✅ Sélecteur de langue trouvé");
        languageToggle.click();
        setTimeout(() => {
            const newLang = window.portfolioI18n?.getCurrentLanguage() || 'fr';
            console.log(`Nouvelle langue: ${newLang}`);
        }, 1000);
    } else {
        console.log("❌ Sélecteur de langue non trouvé");
    }
}

// 2. Test des traductions
function testTranslations() {
    console.log("2️⃣ Test des traductions...");
    
    const elementsWithI18n = document.querySelectorAll('[data-i18n]');
    console.log(`${elementsWithI18n.length} éléments traduisibles trouvés`);
    
    elementsWithI18n.forEach((el, index) => {
        if (index < 5) { // Afficher les 5 premiers
            console.log(`- ${el.getAttribute('data-i18n')}: "${el.textContent.substring(0, 30)}..."`);
        }
    });
}

// 3. Test URL avec paramètre langue
function testLanguageURL() {
    console.log("3️⃣ Test URL avec paramètre langue...");
    
    const currentURL = new URL(window.location);
    const hasLangParam = currentURL.searchParams.has('lang');
    
    if (hasLangParam) {
        console.log(`✅ Paramètre lang trouvé: ${currentURL.searchParams.get('lang')}`);
    } else {
        console.log("ℹ️ Pas de paramètre lang dans l'URL");
        console.log("💡 Essayez: http://localhost:8080?lang=en");
    }
}

// Exécuter tous les tests
console.log("🚀 Démarrage des tests i18n...");
testLanguageSwitch();
setTimeout(testTranslations, 2000);
setTimeout(testLanguageURL, 3000);

console.log("📝 Instructions:");
console.log("1. Cliquez sur le bouton FR/EN en haut à droite");
console.log("2. Observez le changement de langue");
console.log("3. Rechargez avec ?lang=en dans l'URL");
console.log("4. Vérifiez que la langue est conservée");
