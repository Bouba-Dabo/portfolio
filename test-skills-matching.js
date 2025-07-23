// Test Script pour Skills Matching
// Utilisez ce script pour tester automatiquement le système

console.log("🎯 Test du système Skills Matching");

// 1. Remplissage automatique du formulaire
function fillSkillsForm(testCase = 'ai') {
    console.log("1️⃣ Remplissage automatique du formulaire...");
    
    const testCases = {
        ai: {
            domain: 'Intelligence Artificielle',
            technologies: 'Python, TensorFlow, PyTorch, Deep Learning, Machine Learning',
            experience: 'mid',
            projects: 'Réseaux de neurones, NLP, Computer Vision'
        },
        web: {
            domain: 'Développement Web',
            technologies: 'JavaScript, React, Node.js, HTML, CSS',
            experience: 'junior',
            projects: 'Applications web, APIs REST, Frontend'
        },
        data: {
            domain: 'Data Science',
            technologies: 'Python, Pandas, NumPy, Scikit-learn, Jupyter',
            experience: 'mid',
            projects: 'Analyse de données, Visualisation, ML'
        }
    };
    
    const test = testCases[testCase];
    const form = document.getElementById('skills-matching-form');
    
    if (form) {
        // Remplir les champs
        const domainField = form.querySelector('input[name="domain"]');
        const techField = form.querySelector('input[name="technologies"]');
        const expField = form.querySelector('select[name="experience"]');
        const projectsField = form.querySelector('input[name="project-types"]');
        
        if (domainField) domainField.value = test.domain;
        if (techField) techField.value = test.technologies;
        if (expField) expField.value = test.experience;
        if (projectsField) projectsField.value = test.projects;
        
        console.log(`✅ Formulaire rempli avec le cas de test: ${testCase}`);
        return true;
    } else {
        console.log("❌ Formulaire Skills Matching non trouvé");
        return false;
    }
}

// 2. Soumission automatique et analyse
function submitAndAnalyze() {
    console.log("2️⃣ Soumission du formulaire...");
    
    const form = document.getElementById('skills-matching-form');
    const submitBtn = form?.querySelector('.matching-btn');
    
    if (submitBtn) {
        submitBtn.click();
        console.log("✅ Formulaire soumis");
        
        // Attendre les résultats
        setTimeout(() => {
            analyzeResults();
        }, 2000);
    } else {
        console.log("❌ Bouton de soumission non trouvé");
    }
}

// 3. Analyser les résultats
function analyzeResults() {
    console.log("3️⃣ Analyse des résultats...");
    
    const resultsContainer = document.getElementById('matching-results');
    
    if (resultsContainer && resultsContainer.style.display !== 'none') {
        // Score de compatibilité
        const scoreElement = resultsContainer.querySelector('.score-value');
        const score = scoreElement ? scoreElement.textContent : 'N/A';
        console.log(`🎯 Score de compatibilité: ${score}%`);
        
        // Compétences correspondantes
        const matchedSkills = resultsContainer.querySelectorAll('.matched-skills .skill-tag');
        console.log(`✅ Compétences correspondantes: ${matchedSkills.length}`);
        matchedSkills.forEach((skill, index) => {
            if (index < 5) console.log(`  - ${skill.textContent}`);
        });
        
        // Compétences manquantes
        const missingSkills = resultsContainer.querySelectorAll('.missing-skills .skill-tag');
        console.log(`⚠️ Compétences à développer: ${missingSkills.length}`);
        
        // Projets pertinents
        const projects = resultsContainer.querySelectorAll('.project-match-card');
        console.log(`🚀 Projets pertinents: ${projects.length}`);
        
    } else {
        console.log("❌ Résultats non disponibles");
    }
}

// 4. Test des différents cas
function runAllTests() {
    console.log("4️⃣ Test de tous les cas d'usage...");
    
    const testCases = ['ai', 'web', 'data'];
    let currentTest = 0;
    
    function runNextTest() {
        if (currentTest < testCases.length) {
            const testCase = testCases[currentTest];
            console.log(`\n🔄 Test ${currentTest + 1}/3: ${testCase.toUpperCase()}`);
            
            fillSkillsForm(testCase);
            setTimeout(() => {
                submitAndAnalyze();
                currentTest++;
                setTimeout(runNextTest, 5000);
            }, 1000);
        } else {
            console.log("\n🎉 Tous les tests terminés !");
        }
    }
    
    runNextTest();
}

// 5. Navigation vers Skills Matching
function navigateToSkillsMatching() {
    console.log("5️⃣ Navigation vers Skills Matching...");
    
    const skillsLink = document.querySelector('a[href="#skills-matching"]');
    if (skillsLink) {
        skillsLink.click();
        console.log("✅ Navigation vers Skills Matching");
        setTimeout(() => {
            fillSkillsForm('ai'); // Test par défaut
        }, 1000);
    } else {
        console.log("❌ Lien Skills Matching non trouvé");
    }
}

// Interface de test
console.log("📝 Commandes disponibles:");
console.log("- navigateToSkillsMatching() : Aller à la section");
console.log("- fillSkillsForm('ai'|'web'|'data') : Remplir le formulaire");
console.log("- submitAndAnalyze() : Soumettre et analyser");
console.log("- runAllTests() : Tester tous les cas");

console.log("\n🚀 Test rapide:");
console.log("runAllTests()");

// Auto-navigation si on n'est pas sur la bonne section
if (!document.querySelector('#skills-matching')) {
    setTimeout(navigateToSkillsMatching, 2000);
}
