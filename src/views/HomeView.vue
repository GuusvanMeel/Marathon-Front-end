<template>
  <div class="hp-container">
    <!-- Hero Section -->
    <header class="hero">
      <div class="hero-content">
        <span class="badge">EST. 2024</span>
        <h1>BECOME A <span class="highlight">MARATHONER</span></h1>
        <p>
          Transform your ambition into a finish line. Choose your race, define your level,
          and follow a training plan built specifically for your lifestyle.
        </p>
        <div class="cta-group">
          <router-link to="/trainingplans" class="btn btn-primary">Get Started</router-link>
          <a href="#features" class="btn btn-secondary">Learn More</a>
        </div>
      </div>
    </header>

    <!-- Features / How it works -->
    <section id="features" class="features">
      <div class="section-header">
        <h2>HOW IT WORKS</h2>
        <div class="underline"></div>
      </div>

      <div class="feature-grid">
        <div class="feature-card">
          <div class="icon-box">
            <!-- Inline SVG: Map Pin -->
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          <h3>Pick a Race</h3>
          <p>Choose from the world's most famous marathons or set your own custom race date.</p>
        </div>

        <div class="feature-card">
          <div class="icon-box">
            <!-- Inline SVG: Lightning -->
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m13 2-2 10h8l-2 10 8-10h-8l2-10Z"/></svg>
          </div>
          <h3>Select Fitness</h3>
          <p>Whether you are a beginner or a veteran, we adjust the mileage to match your experience.</p>
        </div>

        <div class="feature-card">
          <div class="icon-box">
            <!-- Inline SVG: Calendar -->
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>
          </div>
          <h3>Follow the Plan</h3>
          <p>A day-by-day calendar with distances, pace guides, and rest days for your success.</p>
        </div>
      </div>
    </section>

    <!-- Footer Area -->
    <footer class="footer">
      <p>&copy; 2024 Marathon Training Project. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
// No logic needed as per request
</script>

<style scoped>
/* CSS Reset / Base styles for this page */
.hp-container {
  font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background-color: #0f172a;
  color: #f8fafc;
  min-height: 100vh;
  margin: 0;
}

/* Hero Section */
.hero {
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: radial-gradient(circle at top right, #1e293b, #0f172a);
  padding: 0 20px;
}

.hero-content {
  max-width: 800px;
}

.badge {
  background: #334155;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 0.8rem;
  letter-spacing: 2px;
  color: #94a3b8;
}

h1 {
  font-size: clamp(2.5rem, 8vw, 4.5rem);
  font-weight: 900;
  margin: 20px 0;
  line-height: 1.1;
}

.highlight {
  color: #22c55e; /* Marathon Green */
}

p {
  font-size: 1.2rem;
  color: #94a3b8;
  line-height: 1.6;
  margin-bottom: 40px;
}

/* Buttons */
.cta-group {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.btn {
  padding: 15px 35px;
  border-radius: 8px;
  font-weight: bold;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #22c55e;
  color: #052e16;
}

.btn-primary:hover {
  background-color: #16a34a;
  transform: translateY(-2px);
}

.btn-secondary {
  border: 1px solid #334155;
  color: white;
}

.btn-secondary:hover {
  background-color: #1e293b;
}

/* Features Section */
.features {
  padding: 100px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.underline {
  height: 4px;
  width: 50px;
  background: #22c55e;
  margin: 10px auto;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.feature-card {
  background: #1e293b;
  padding: 40px;
  border-radius: 16px;
  border: 1px solid #334155;
  transition: border-color 0.3s ease;
}

.feature-card:hover {
  border-color: #22c55e;
}

.icon-box {
  color: #22c55e;
  margin-bottom: 20px;
}

.feature-card h3 {
  margin-bottom: 15px;
  font-size: 1.5rem;
}

.feature-card p {
  font-size: 1rem;
  margin-bottom: 0;
}

/* Footer */
.footer {
  text-align: center;
  padding: 40px;
  color: #475569;
  border-top: 1px solid #1e293b;
}

@media (max-width: 600px) {
  .cta-group {
    flex-direction: column;
  }
}
</style>
