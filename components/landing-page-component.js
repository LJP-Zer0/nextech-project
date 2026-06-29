export default {
  name: 'landing-page-component',
  template: /* html */ `
    <div class="container py-4">
      <h1 class="mb-3">Welcome to List Keeper!</h1>
      <p class="lead">A calm place to keep helpful lists, reminders, and easy-to-use notes.</p>
      <router-link to="/items" class="btn btn-primary mb-4"><i class="bi bi-bookmark me-1"></i>Browse Lists</router-link>

      <h2 class="h4 mt-4">About List Keeper</h2>
      <p>
        List Keeper is a simple app for people who want a clear place to save useful information. It works well for shopping, planning, to-do lists, and other practical lists.
      </p>
      
    </div>
  `,
};
