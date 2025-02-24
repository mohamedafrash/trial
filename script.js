document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('healthForm');
    const sections = document.querySelectorAll('.form-section');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    const progress = document.getElementById('progress');
    const steps = document.querySelectorAll('.step');
    
    let currentSection = 0;
    
    // Initialize
    updateButtons();
    updateProgress();
    
    // Navigation
    nextBtn.addEventListener('click', () => {
        if (validateSection(currentSection)) {
            sections[currentSection].classList.add('hidden');
            currentSection++;
            sections[currentSection].classList.remove('hidden');
            updateButtons();
            updateProgress();
        }
    });
    
    prevBtn.addEventListener('click', () => {
        sections[currentSection].classList.add('hidden');
        currentSection--;
        sections[currentSection].classList.remove('hidden');
        updateButtons();
        updateProgress();
    });
    
    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (validateSection(currentSection)) {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            try {
                const response = await fetch('/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                if (result.success) {
                    alert('Form submitted successfully!');
                    form.reset();
                    // Reset to first section
                    currentSection = 0;
                    sections.forEach((section, idx) => {
                        section.classList.toggle('hidden', idx !== 0);
                    });
                    updateButtons();
                    updateProgress();
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Failed to submit form. Please try again.');
            }
        }
    });
    
    // Update button visibility
    function updateButtons() {
        prevBtn.style.display = currentSection === 0 ? 'none' : 'block';
        if (currentSection === sections.length - 1) {
            nextBtn.style.display = 'none';
            submitBtn.classList.remove('hidden');
        } else {
            nextBtn.style.display = 'block';
            submitBtn.classList.add('hidden');
        }
    }
    
    // Update progress bar and steps
    function updateProgress() {
        const progressWidth = (currentSection / (sections.length - 1)) * 100;
        progress.style.width = `${progressWidth}%`;
        
        steps.forEach((step, idx) => {
            if (idx <= currentSection) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }
    
    // Validate current section
    function validateSection(sectionIndex) {
        const currentSection = sections[sectionIndex];
        const requiredFields = currentSection.querySelectorAll('select[required], textarea[required]');
        
        let valid = true;
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                valid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        });
        
        return valid;
    }
});
