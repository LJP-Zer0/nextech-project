export default {
  name: 'collection-page-component',
  setup() {
    const itemsStore = Vue.inject('itemsStore');
    const newListName = Vue.ref('');
    const showCreateMenu = Vue.ref(false);
    const editingListId = Vue.ref(null);
    const editName = Vue.ref('');
    const editDescription = Vue.ref('');
    const editImageUrl = Vue.ref('');

    const createList = () => {
      const added = itemsStore.addList(newListName.value);
      if (added) {
        newListName.value = '';
        showCreateMenu.value = false;
      }
    };

    const toggleCreateMenu = () => {
      showCreateMenu.value = !showCreateMenu.value;
      if (!showCreateMenu.value) {
        newListName.value = '';
      }
    };

    const deleteList = (id) => {
      itemsStore.deleteList(id);
    };

    const startEditing = (item) => {
      editingListId.value = item.id;
      editName.value = item.name || '';
      editDescription.value = item.description || '';
      editImageUrl.value = item.imageUrl || '';
    };

    const cancelEditing = () => {
      editingListId.value = null;
      editName.value = '';
      editDescription.value = '';
      editImageUrl.value = '';
    };

    const saveEditing = (id) => {
      const updated = itemsStore.editList(id, {
        name: editName.value,
        description: editDescription.value,
        imageUrl: editImageUrl.value,
      });

      if (updated) {
        cancelEditing();
      }
    };

    return {
      itemsStore,
      newListName,
      showCreateMenu,
      editingListId,
      editName,
      editDescription,
      editImageUrl,
      createList,
      toggleCreateMenu,
      deleteList,
      startEditing,
      cancelEditing,
      saveEditing,
    };
  },
  template: /* html */ `
    <section class="container py-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h1 class="h3 mb-0">My Lists</h1>
        <span class="badge text-bg-light border">{{ itemsStore.items.length }} lists</span>
      </div>

      <p class="text-muted">Create a new list in one step, or open an existing one to see details.</p>

      <div v-if="itemsStore.feedbackMessage" class="alert alert-info py-2 mb-3" role="status">
        {{ itemsStore.feedbackMessage }}
      </div>

      <div class="card border-0 shadow-sm mb-4">
        <div class="card-body">
          <button type="button" class="btn btn-primary" @click="toggleCreateMenu">
            {{ showCreateMenu ? 'Close' : 'Create new list' }}
          </button>

          <div v-if="showCreateMenu" class="mt-3 border-top pt-3">
            <div class="d-flex flex-column flex-md-row gap-2 align-items-md-end">
              <div class="flex-grow-1">
                <label for="new-list-name" class="form-label small text-muted mb-1">New list name</label>
                <input
                  id="new-list-name"
                  v-model="newListName"
                  type="text"
                  class="form-control"
                  placeholder="e.g. Weekend meal prep"
                  @keydown.enter.prevent="createList" />
              </div>
              <button type="button" class="btn btn-outline-primary" @click="createList">Add list</button>
            </div>
            <p class="small text-muted mt-2 mb-0">Quick and simple. Add a name and keep going.</p>
          </div>
        </div>
      </div>

      <div v-if="itemsStore.isLoading" class="alert alert-secondary" role="status">
        Loading items...
      </div>

      <div v-else-if="itemsStore.error" class="alert alert-danger" role="alert">
        {{ itemsStore.error }}
      </div>

      <div v-else-if="itemsStore.items.length === 0" class="alert alert-warning" role="alert">
        Your list area is empty. Create your first list to get started.
      </div>

      <div v-else class="row g-3">
        <div class="col-12 col-md-6 col-lg-4" v-for="item in itemsStore.items" :key="item.id">
          <article class="card h-100 shadow-sm border-0">
            <img
              v-if="item.imageUrl"
              :src="item.imageUrl"
              :alt="item.name"
              class="card-img-top collection-card-image object-fit-cover" />
            <div
              v-else
              class="collection-card-image d-flex align-items-center justify-content-center bg-light text-muted">
              No image available
            </div>

            <div class="card-body d-flex flex-column">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <h2 class="h5 card-title mb-0">{{ item.name }}</h2>
                <span class="badge text-bg-primary ms-2">{{ item.category || 'General' }}</span>
              </div>

              <p class="card-text text-muted flex-grow-1 collection-description">
                {{ item.description || 'No description available.' }}
              </p>

              <div v-if="item.isCustom && editingListId === item.id" class="border rounded p-3 mb-3 bg-light">
                <div class="mb-2">
                  <label :for="'edit-name-' + item.id" class="form-label small text-muted mb-1">List name</label>
                  <input
                    :id="'edit-name-' + item.id"
                    v-model="editName"
                    type="text"
                    class="form-control form-control-sm"
                    placeholder="Name your list" />
                </div>

                <div class="mb-2">
                  <label :for="'edit-description-' + item.id" class="form-label small text-muted mb-1">Description</label>
                  <textarea
                    :id="'edit-description-' + item.id"
                    v-model="editDescription"
                    class="form-control form-control-sm"
                    rows="2"
                    placeholder="Add a short note"></textarea>
                </div>

                <div class="mb-2">
                  <label :for="'edit-image-' + item.id" class="form-label small text-muted mb-1">Image URL</label>
                  <input
                    :id="'edit-image-' + item.id"
                    v-model="editImageUrl"
                    type="url"
                    class="form-control form-control-sm"
                    placeholder="https://example.com/image.jpg" />
                </div>

                <div class="d-flex gap-2">
                  <button type="button" class="btn btn-sm btn-primary" @click="saveEditing(item.id)">Save</button>
                  <button type="button" class="btn btn-sm btn-outline-secondary" @click="cancelEditing">Cancel</button>
                </div>
              </div>

              <div class="d-flex gap-2">
                <button
                  v-if="item.isCustom"
                  type="button"
                  class="btn btn-outline-success btn-sm flex-grow-1"
                  @click="startEditing(item)">
                  Customize
                </button>
                <button
                  v-else
                  type="button"
                  class="btn btn-outline-secondary btn-sm flex-grow-1"
                  @click="deleteList(item.id)">
                  Remove
                </button>
                <button
                  type="button"
                  class="btn btn-outline-danger btn-sm"
                  @click="deleteList(item.id)">
                  {{ item.isCustom ? 'Delete' : 'Remove' }}
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  `,
};
