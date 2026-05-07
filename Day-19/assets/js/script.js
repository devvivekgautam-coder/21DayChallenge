const posts = [
    {
        title: 'Designing for the Future of Web Experiences',
        category: 'Design',
        author: 'Sophia Carter',
        date: 'May 2, 2026',
        readTime: '6 min read',
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop',
        excerpt: 'Explore modern UI patterns, immersive layouts, and futuristic digital experiences.'
    },

    {
        title: 'Mastering React Animations with Framer Motion',
        category: 'Development',
        author: 'Daniel Lee',
        date: 'April 28, 2026',
        readTime: '8 min read',
        image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop',
        excerpt: 'Learn smooth animation techniques to create engaging modern websites and apps.'
    },

    {
        title: 'How AI is Transforming Digital Creativity',
        category: 'AI',
        author: 'Emma Watson',
        date: 'April 20, 2026',
        readTime: '5 min read',
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200&auto=format&fit=crop',
        excerpt: 'Artificial intelligence is reshaping design, storytelling, and content creation.'
    },

    {
        title: 'Building Premium Interfaces with Tailwind CSS',
        category: 'CSS',
        author: 'James Miller',
        date: 'April 15, 2026',
        readTime: '7 min read',
        image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1200&auto=format&fit=crop',
        excerpt: 'Discover advanced UI techniques and create beautiful modern interfaces.'
    },

    {
        title: 'Minimalism in Product Design',
        category: 'Design',
        author: 'Olivia Brown',
        date: 'April 10, 2026',
        readTime: '4 min read',
        image: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=80&w=1200&auto=format&fit=crop',
        excerpt: 'Why simplicity and clean layouts dominate premium user experiences today.'
    },

    {
        title: 'The Rise of Interactive Storytelling',
        category: 'Trends',
        author: 'Noah Wilson',
        date: 'April 4, 2026',
        readTime: '9 min read',
        image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop',
        excerpt: 'Immersive storytelling is changing how brands engage with modern audiences.'
    }
];


const blogGrid = document.getElementById('blogGrid');
const searchInput = document.getElementById('searchInput');
const filterButtons = document.getElementById('filterButtons');
const resultsCount = document.getElementById('resultsCount');


let currentCategory = 'All';


const categories = ['All', ...new Set(posts.map(post => post.category))];


function createFilterButtons() {
    categories.forEach(category => {
        const button = document.createElement('button');

        button.innerText = category;
        button.classList.add('filter-btn');

        if (category === 'All') {
            button.classList.add('active');
        }

        button.addEventListener('click', () => {

            currentCategory = category;

            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });

            button.classList.add('active');

            renderPosts();
        });

        filterButtons.appendChild(button);
    });
}


function renderPosts() {

    const searchValue = searchInput.value.toLowerCase();

    const filteredPosts = posts.filter(post => {

        const matchesSearch = post.title.toLowerCase().includes(searchValue);

        const matchesCategory = currentCategory === 'All' || post.category === currentCategory;

        return matchesSearch && matchesCategory;
    });


    resultsCount.innerText = `Showing ${filteredPosts.length} articles`;

    blogGrid.innerHTML = '';


    if (filteredPosts.length === 0) {
        blogGrid.innerHTML = `
          <div style="grid-column:1/-1;text-align:center;padding:80px 20px;">
            <h2 style="font-size:2rem;margin-bottom:10px;">No Articles Found</h2>
            <p style="color:#aaa;">Try another keyword or category.</p>
          </div>
        `;

        return;
    }


    filteredPosts.forEach(post => {

        const card = document.createElement('div');

        card.classList.add('blog-card');

        card.innerHTML = `

          <div class="blog-image">
            <img src="${post.image}" alt="${post.title}">
            <div class="category">${post.category}</div>
          </div>

          <div class="blog-content">

            <div class="meta">
              <span>${post.author}</span>
              <span>•</span>
              <span>${post.readTime}</span>
            </div>

            <h3>${post.title}</h3>

            <p>${post.excerpt}</p>

            <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;">
              <span style="color:#9e9e9e;font-size:0.9rem;">${post.date}</span>

              <button class="read-btn">Read More</button>
            </div>

          </div>
        `;

        blogGrid.appendChild(card);
    });
}


searchInput.addEventListener('input', renderPosts);


createFilterButtons();
renderPosts();