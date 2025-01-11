document.addEventListener("DOMContentLoaded", function() {
    const index = document.querySelector('.index'); // The container for the index menu
    const headers = document.querySelectorAll('.book h1, .book h2'); // Select all h1 and h2 tags
    const navItems = [];

    headers.forEach((header, index) => {
        const link = document.createElement('a');
        const id = `section-${index}`;
        header.id = id;
        link.href = `#${id}`;
        link.textContent = header.tagName === 'H1' ? header.textContent : `- ${header.textContent}`;
        const listItem = document.createElement('li');
        listItem.appendChild(link);
        document.querySelector('.contents').appendChild(listItem);
        navItems.push({ id, listItem });
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the header is visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const navItem = navItems.find(item => item.id === entry.target.id);
            if (entry.isIntersecting) {
                navItem.listItem.classList.add('active');
            } else {
                navItem.listItem.classList.remove('active');
            }
        });
    }, observerOptions);

    headers.forEach(header => observer.observe(header));
});
// Add active class when clicking on the contents title
document.getElementById('contents-title').addEventListener('click', function() {
    document.body.classList.toggle('contents-active');
});

// Remove active class when clicking on any <a> inside the contents list
document.getElementById('contents-list').addEventListener('click', function(event) {
    if (event.target.tagName.toLowerCase() === 'a') {
        document.body.classList.remove('contents-active');
    }
});


