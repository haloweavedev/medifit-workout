// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }

    // Initialize page-specific functionality
    initializeFilters();
    initializeWorkoutPage();
    initializeVideoModal();
});

// Archive Page Filtering
function initializeFilters() {
    const levelFilter = document.getElementById('levelFilter');
    const durationFilter = document.getElementById('durationFilter');
    const typeFilter = document.getElementById('typeFilter');
    const programsGrid = document.getElementById('programsGrid');

    if (!levelFilter || !durationFilter || !typeFilter || !programsGrid) return;

    function filterPrograms() {
        const level = levelFilter.value;
        const duration = durationFilter.value;
        const type = typeFilter.value;
        
        const programCards = programsGrid.querySelectorAll('.program-card');
        
        programCards.forEach(card => {
            const cardLevel = card.dataset.level;
            const cardDuration = card.dataset.duration;
            const cardType = card.dataset.type;
            
            const levelMatch = !level || cardLevel === level;
            const durationMatch = !duration || cardDuration === duration;
            const typeMatch = !type || cardType === type;
            
            if (levelMatch && durationMatch && typeMatch) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.5s ease-in';
            } else {
                card.style.display = 'none';
            }
        });
    }

    levelFilter.addEventListener('change', filterPrograms);
    durationFilter.addEventListener('change', filterPrograms);
    typeFilter.addEventListener('change', filterPrograms);
}

// Workout Page Functionality
function initializeWorkoutPage() {
    const dayTabs = document.querySelectorAll('.day-tab');
    const workoutDays = document.querySelectorAll('.workout-day');

    if (dayTabs.length === 0 || workoutDays.length === 0) return;

    // Initialize program data from URL parameters
    loadProgramData();

    // Day tab functionality
    dayTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const day = this.dataset.day;
            
            // Remove active class from all tabs and days
            dayTabs.forEach(t => t.classList.remove('active'));
            workoutDays.forEach(d => d.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Show corresponding day content
            const targetDay = document.getElementById(`day${day}`);
            if (targetDay) {
                targetDay.classList.add('active');
                
                // Smooth scroll to content
                targetDay.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }
        });
    });

    // Adjust day tabs based on program duration
    adjustDayTabs();
}

// Load program data from URL parameters
function loadProgramData() {
    const urlParams = new URLSearchParams(window.location.search);
    const program = urlParams.get('program');
    
    if (!program) return;

    const programData = getProgramData(program);
    
    if (programData) {
        updateProgramInfo(programData);
    }
}

// Get program data based on program ID
function getProgramData(programId) {
    const programs = {
        'mobility-3-beginner': {
            title: 'Mobility & Flexibility - 3 Days Program',
            level: 'Beginner',
            duration: '3 Days',
            type: 'Mobility & Flexibility',
            description: 'Improve your range of motion and flexibility with gentle stretching routines designed for beginners.'
        },
        'muscle-gain-5-beginner': {
            title: 'Muscle Gain - 5 Days Program',
            level: 'Beginner',
            duration: '5 Days',
            type: 'Muscle Gain',
            description: 'Build lean muscle mass with progressive strength training exercises designed for beginners.'
        },
        'fat-loss-3-beginner': {
            title: 'Fat Loss - 3 Days Program',
            level: 'Beginner',
            duration: '3 Days',
            type: 'Fat Loss',
            description: 'Burn calories and shed unwanted fat with effective cardio and strength combinations.'
        },
        'hiit-5-beginner': {
            title: 'HIIT Training - 5 Days Program',
            level: 'Beginner',
            duration: '5 Days',
            type: 'HIIT Training',
            description: 'High-intensity interval training for maximum results in minimum time.'
        },
        'crossfit-5-advanced': {
            title: 'CrossFit - 5 Days Program',
            level: 'Advanced',
            duration: '5 Days',
            type: 'CrossFit',
            description: 'Functional fitness combining strength, cardio, and gymnastics movements.'
        },
        'muscle-gain-3-advanced': {
            title: 'Advanced Muscle Gain - 3 Days Program',
            level: 'Advanced',
            duration: '3 Days',
            type: 'Muscle Gain',
            description: 'Intensive muscle building with heavy compound movements and advanced techniques.'
        },
        'fat-loss-5-advanced': {
            title: 'Advanced Fat Loss - 5 Days Program',
            level: 'Advanced',
            duration: '5 Days',
            type: 'Fat Loss',
            description: 'High-intensity fat burning with complex movement patterns and metabolic conditioning.'
        },
        'mobility-3-advanced': {
            title: 'Advanced Mobility - 3 Days Program',
            level: 'Advanced',
            duration: '3 Days',
            type: 'Mobility & Flexibility',
            description: 'Deep tissue work and advanced flexibility techniques for elite performance.'
        }
    };
    
    return programs[programId] || null;
}

// Update program information on the page
function updateProgramInfo(programData) {
    const programTitle = document.getElementById('programTitle');
    const programLevel = document.getElementById('programLevel');
    const programDuration = document.getElementById('programDuration');
    const programType = document.getElementById('programType');
    const programDescription = document.getElementById('programDescription');
    const currentProgram = document.getElementById('currentProgram');
    
    if (programTitle) programTitle.textContent = programData.title;
    if (programLevel) programLevel.textContent = programData.level;
    if (programDuration) programDuration.textContent = programData.duration;
    if (programType) programType.textContent = programData.type;
    if (programDescription) programDescription.textContent = programData.description;
    if (currentProgram) currentProgram.textContent = programData.title;
}

// Adjust day tabs based on program duration
function adjustDayTabs() {
    const urlParams = new URLSearchParams(window.location.search);
    const program = urlParams.get('program');
    
    if (!program) return;

    const dayTabs = document.querySelectorAll('.day-tab');
    const workoutDays = document.querySelectorAll('.workout-day');
    
    // Determine if it's a 3-day or 5-day program
    const is3DayProgram = program.includes('3-');
    
    if (is3DayProgram) {
        // Hide day 4 and 5 tabs and content for 3-day programs
        dayTabs.forEach((tab, index) => {
            if (index >= 3) {
                tab.style.display = 'none';
            }
        });
        
        workoutDays.forEach((day, index) => {
            if (index >= 3) {
                day.style.display = 'none';
            }
        });
    }
}

// Video Modal Functionality
function initializeVideoModal() {
    const videoModal = document.getElementById('videoModal');
    const closeModal = document.querySelector('.close-modal');
    
    if (!videoModal || !closeModal) return;

    // Close modal functionality
    closeModal.addEventListener('click', function() {
        videoModal.classList.remove('show');
        document.body.style.overflow = 'auto';
    });

    // Close modal when clicking outside
    videoModal.addEventListener('click', function(e) {
        if (e.target === videoModal) {
            videoModal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && videoModal.classList.contains('show')) {
            videoModal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });
}

// Play Video Function
function playVideo(exerciseName) {
    const videoModal = document.getElementById('videoModal');
    const videoTitle = document.getElementById('videoTitle');
    const videoPlayer = document.getElementById('videoPlayer');
    const exerciseInstructions = document.getElementById('exerciseInstructions');
    
    if (!videoModal) return;

    // Get exercise data
    const exerciseData = getExerciseData(exerciseName);
    
    // Update modal content
    if (videoTitle) {
        videoTitle.textContent = exerciseData.title;
    }
    
    if (videoPlayer) {
        videoPlayer.src = exerciseData.videoUrl;
        videoPlayer.alt = exerciseData.title;
    }
    
    if (exerciseInstructions) {
        exerciseInstructions.innerHTML = '';
        exerciseData.instructions.forEach(instruction => {
            const li = document.createElement('li');
            li.textContent = instruction;
            exerciseInstructions.appendChild(li);
        });
    }
    
    // Show modal
    videoModal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// Get exercise data
function getExerciseData(exerciseName) {
    const exercises = {
        'pull-ups': {
            title: 'Pull-Ups',
            videoUrl: 'https://via.placeholder.com/640x360/4a90e2/ffffff?text=Pull-Ups+Video',
            instructions: [
                'Grab the pull-up bar with an overhand grip, hands shoulder-width apart',
                'Hang with arms fully extended and feet off the ground',
                'Pull your body up until your chin clears the bar',
                'Lower yourself back down with control to the starting position',
                'Keep your core engaged throughout the movement'
            ]
        },
        'push-ups': {
            title: 'Push-Ups',
            videoUrl: 'https://via.placeholder.com/640x360/28a745/ffffff?text=Push-Ups+Video',
            instructions: [
                'Start in a plank position with hands slightly wider than shoulders',
                'Keep your body in a straight line from head to heels',
                'Lower your chest toward the ground by bending your elbows',
                'Push back up to the starting position',
                'Maintain tight core and neutral spine throughout'
            ]
        },
        'dumbbell-rows': {
            title: 'Dumbbell Rows',
            videoUrl: 'https://via.placeholder.com/640x360/dc3545/ffffff?text=Dumbbell+Rows+Video',
            instructions: [
                'Hold a dumbbell in one hand, support yourself with the other',
                'Keep your back straight and core engaged',
                'Pull the dumbbell up to your ribcage, squeezing your shoulder blade',
                'Lower the weight with control',
                'Complete all reps on one side before switching'
            ]
        },
        'shoulder-press': {
            title: 'Shoulder Press',
            videoUrl: 'https://via.placeholder.com/640x360/fd7e14/ffffff?text=Shoulder+Press+Video',
            instructions: [
                'Hold dumbbells at shoulder height with palms facing forward',
                'Stand with feet shoulder-width apart, core braced',
                'Press the weights overhead until arms are fully extended',
                'Lower the weights back to shoulder height with control',
                'Keep your back straight and avoid arching'
            ]
        },
        'squats': {
            title: 'Squats',
            videoUrl: 'https://via.placeholder.com/640x360/6f42c1/ffffff?text=Squats+Video',
            instructions: [
                'Stand with feet shoulder-width apart, toes slightly turned out',
                'Keep your chest up and core engaged',
                'Lower your hips back and down as if sitting in a chair',
                'Descend until thighs are parallel to the ground',
                'Drive through your heels to return to standing'
            ]
        },
        'lunges': {
            title: 'Lunges',
            videoUrl: 'https://via.placeholder.com/640x360/20c997/ffffff?text=Lunges+Video',
            instructions: [
                'Stand tall with feet hip-width apart',
                'Step forward with one leg, lowering your hips',
                'Lower until both knees are bent at 90-degree angles',
                'Push back to the starting position',
                'Alternate legs or complete all reps on one side first'
            ]
        },
        'romanian-deadlifts': {
            title: 'Romanian Deadlifts',
            videoUrl: 'https://via.placeholder.com/640x360/e83e8c/ffffff?text=Romanian+Deadlifts+Video',
            instructions: [
                'Hold a barbell or dumbbells with an overhand grip',
                'Stand with feet hip-width apart, slight bend in knees',
                'Hinge at the hips, pushing your hips back',
                'Lower the weight while keeping it close to your legs',
                'Drive your hips forward to return to standing'
            ]
        },
        'calf-raises': {
            title: 'Calf Raises',
            videoUrl: 'https://via.placeholder.com/640x360/6c757d/ffffff?text=Calf+Raises+Video',
            instructions: [
                'Stand with the balls of your feet on a raised surface',
                'Hold dumbbells for added resistance if desired',
                'Rise up onto your toes as high as possible',
                'Squeeze your calf muscles at the top',
                'Lower slowly back to the starting position'
            ]
        },
        'planks': {
            title: 'Planks',
            videoUrl: 'https://via.placeholder.com/640x360/17a2b8/ffffff?text=Planks+Video',
            instructions: [
                'Start in a push-up position, then lower onto your forearms',
                'Keep your body in a straight line from head to heels',
                'Engage your core and squeeze your glutes',
                'Breathe normally while holding the position',
                'Avoid sagging hips or raising your butt too high'
            ]
        }
    };
    
    return exercises[exerciseName] || {
        title: 'Exercise Video',
        videoUrl: 'https://via.placeholder.com/640x360/000000/ffffff?text=Exercise+Video',
        instructions: ['Exercise instructions will be available soon.']
    };
}

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Add fade-in animation for program cards
function addFadeInAnimation() {
    const programCards = document.querySelectorAll('.program-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    programCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    addFadeInAnimation();
});

// Add CSS animation keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .workout-day.active {
        animation: slideDown 0.5s ease-out;
    }
`;
document.head.appendChild(style);

// Add loading state for video modal
function showLoadingState() {
    const videoModal = document.getElementById('videoModal');
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = `
        <div class="loading-spinner"></div>
        <p>Loading video...</p>
    `;
    
    if (videoModal) {
        videoModal.appendChild(loadingOverlay);
        
        // Remove loading state after 2 seconds (simulated loading)
        setTimeout(() => {
            if (loadingOverlay.parentNode) {
                loadingOverlay.parentNode.removeChild(loadingOverlay);
            }
        }, 2000);
    }
}

// Add search functionality for exercise cards
function addExerciseSearch() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search exercises...';
    searchInput.className = 'exercise-search';
    
    const workoutContent = document.querySelector('.workout-content .container');
    if (workoutContent) {
        workoutContent.insertBefore(searchInput, workoutContent.firstChild);
        
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const exerciseCards = document.querySelectorAll('.exercise-card');
            
            exerciseCards.forEach(card => {
                const exerciseName = card.querySelector('h4').textContent.toLowerCase();
                const exerciseDescription = card.querySelector('p').textContent.toLowerCase();
                
                if (exerciseName.includes(searchTerm) || exerciseDescription.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
}

// Initialize exercise search on workout page
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.workout-content')) {
        addExerciseSearch();
    }
});