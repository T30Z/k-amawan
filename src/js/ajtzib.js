const mayanDigits = ['𝋠', '𝋡', '𝋢', '𝋣', '𝋤', '𝋥', '𝋦', '𝋧', '𝋨', '𝋩', '𝋪', '𝋫', '𝋬', '𝋭', '𝋮', '𝋯', '𝋰', '𝋱', '𝋲', '𝋳'];

document.addEventListener('DOMContentLoaded', () => {
    const regularInput = document.getElementById('regularInput');
    const mayanBlockContainer = document.getElementById('mayanBlockContainer');
    const formulaDisplay = document.getElementById('formulaDisplay');
    
    let lastShakeTime = 0;

    regularInput.addEventListener('focus', () => {
        if (regularInput.value === '0') {
            regularInput.value = '';
        }
    });

    regularInput.addEventListener('blur', () => {
        if (regularInput.value === '') {
            regularInput.value = '0';
            updateMayanDisplay(0); // Reset Mayan display to 0
        }
    });

    regularInput.addEventListener('input', () => {
        let value = regularInput.value;

        // Allow only numbers in the input
        value = value.replace(/\D/g, '');

        if (value === '') {
            value = '';
            formulaDisplay.textContent = ''; // Hide formula when input is empty
            updateMayanDisplay(0);
        } else {
            regularInput.value = value;
            updateMayanDisplay(parseInt(value));
        }
    });

    function updateMayanDisplay(number) {
        // Clear previous Mayan numbers and formula
        mayanBlockContainer.innerHTML = '';
        if (number === 0) {
            createMayanNumberDiv(0).forEach(div => mayanBlockContainer.appendChild(div));
            formulaDisplay.textContent = ''; // Hide formula for 0
            return;
        }

        let formulaParts = [];
        let position = 0;
        let originalNumber = number;

        while (number > 0) {
            let value = number % 20;
            if (value > 0 || position === 0) {
                createMayanNumberDiv(value).forEach(div => mayanBlockContainer.insertBefore(div, mayanBlockContainer.firstChild));
                formulaParts.unshift(`(${value} × 20^${position})`);
            }
            number = Math.floor(number / 20);
            position++;
        }

        formulaDisplay.textContent = `${originalNumber} = ` + formulaParts.join(' + ');
    }

    function createMayanNumberDiv(value) {
        let div = document.createElement('div');
        div.className = 'mayan-number';
        div.textContent = mayanDigits[value];
        return [div];
    }

    function handleShakeEvent(event) {
        const acceleration = event.accelerationIncludingGravity;
        const currentTime = new Date().getTime();
        
        if ((currentTime - lastShakeTime) > 1000) { // to avoid multiple triggers in short time
            const shakeThreshold = 15; // Sensitivity threshold
            const accelerationMagnitude = Math.sqrt(acceleration.x ** 2 + acceleration.y ** 2 + acceleration.z ** 2);

            if (accelerationMagnitude > shakeThreshold) {
                lastShakeTime = currentTime;
                regularInput.value = '0';
                updateMayanDisplay(0);
            }
        }
    }

    window.addEventListener('devicemotion', handleShakeEvent);

    updateMayanDisplay(0); // Initialize with 0
});
