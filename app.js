import LandingPageComponent from './components/landing-page-component.js';
import AboutPageComponent from './components/about-page-component.js';
import NavbarComponent from './components/navbar-component.js';
import CollectionPageComponent from './components/collection-page-component.js';
import ItemDetailPageComponent from './components/item-detail-page-component.js';

const STORAGE_KEY = 'personal-lists';

const loadSavedLists = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return [];
    }

    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
};

const persistCustomLists = (customLists) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(customLists));
};

const routes = [
  {
    path: '/',
    component: LandingPageComponent,
  },
  {
    path: '/about',
    component: AboutPageComponent,
  },
  {
    path: '/items',
    component: CollectionPageComponent,
  },
  {
    path: '/items/:id',
    component: ItemDetailPageComponent,
  },
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes,
});

const app = Vue.createApp({
  setup() {
    const itemsStore = Vue.reactive({
      items: [],
      baseItems: [],
      isLoading: true,
      error: '',
      feedbackMessage: '',
      feedbackVisible: true,
      feedbackTimeoutId: null,
      setFeedbackMessage(message) {
        if (itemsStore.feedbackTimeoutId) {
          window.clearTimeout(itemsStore.feedbackTimeoutId);
        }

        if (!message) {
          itemsStore.feedbackMessage = '';
          itemsStore.feedbackVisible = true;
          itemsStore.feedbackTimeoutId = null;
          return;
        }

        itemsStore.feedbackMessage = message;
        itemsStore.feedbackVisible = true;

        itemsStore.feedbackTimeoutId = window.setTimeout(() => {
          itemsStore.feedbackVisible = false;

          itemsStore.feedbackTimeoutId = window.setTimeout(() => {
            itemsStore.feedbackMessage = '';
            itemsStore.feedbackVisible = true;
            itemsStore.feedbackTimeoutId = null;
          }, 400);
        }, 5000);
      },
      addList(name, description = '', imageUrl = '') {
        const trimmedName = String(name || '').trim();
        const trimmedDescription = String(description || '').trim();
        const trimmedImageUrl = String(imageUrl || '').trim();

        if (!trimmedName) {
          itemsStore.setFeedbackMessage('Please enter a list name.');
          return false;
        }

        const newItem = {
          id: `custom-${Date.now()}`,
          name: trimmedName,
          description: trimmedDescription || 'A list you created.',
          category: 'Custom',
          imageUrl: trimmedImageUrl,
          location: 'Personal',
          instructions: '',
          isCustom: true,
        };

        const customLists = itemsStore.items.filter((item) => item.isCustom);
        itemsStore.items = [...customLists, newItem];
        persistCustomLists(itemsStore.items.filter((item) => item.isCustom));
        itemsStore.setFeedbackMessage(`Added "${trimmedName}" to your lists.`);
        return true;
      },
      deleteList(id) {
        const removedItem = itemsStore.items.find((item) => item.id === id);
        const nextItems = itemsStore.items.filter((item) => item.id !== id);
        itemsStore.items = nextItems;
        persistCustomLists(itemsStore.items.filter((item) => item.isCustom));
        itemsStore.setFeedbackMessage(removedItem?.isCustom ? 'Your list was removed.' : 'List removed from your view.');
      },
      editList(id, updates) {
        const target = itemsStore.items.find((item) => item.id === id);

        if (!target || !target.isCustom) {
          return false;
        }

        const nextItems = itemsStore.items.map((item) => {
          if (item.id !== id) {
            return item;
          }

          return {
            ...item,
            name: String(updates.name || item.name || '').trim(),
            description: String(updates.description || item.description || '').trim(),
            imageUrl: String(updates.imageUrl || item.imageUrl || '').trim(),
          };
        });

        itemsStore.items = nextItems;
        persistCustomLists(itemsStore.items.filter((item) => item.isCustom));
        itemsStore.setFeedbackMessage('Your list was updated.');
        return true;
      },
    });

    fetch('items.csv')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Could not load CSV data file.');
        }
        return response.text();
      })
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: ({ data, errors }) => {
            if (errors.length > 0) {
              itemsStore.error = 'There was a problem reading the CSV data.';
              itemsStore.items = [];
              itemsStore.baseItems = [];
            } else {
              const parsedItems = data.map((row) => ({
                id: String(row.id || '').trim(),
                name: String(row.name || row.task || row.title || '').trim(),
                description: String(row.description || row.notes || '').trim(),
                category: String(row.category || row.type || '').trim(),
                imageUrl: String(row.image_url || row.imageUrl || row.image || '').trim(),
                location: String(row.location || '').trim(),
                instructions: String(row.instructions || '').trim(),
              }));

              const savedLists = loadSavedLists();
              itemsStore.baseItems = parsedItems;
              itemsStore.items = savedLists;
              itemsStore.error = '';
            }
            itemsStore.isLoading = false;
          },
          error: () => {
            itemsStore.error = 'There was a problem parsing CSV data.';
            itemsStore.items = [];
            itemsStore.baseItems = [];
            itemsStore.isLoading = false;
          },
        });
      })
      .catch(() => {
        itemsStore.error = 'There was a problem loading data.';
        itemsStore.items = [];
        itemsStore.baseItems = [];
        itemsStore.isLoading = false;
      });

    Vue.provide('itemsStore', itemsStore);

    return {};
  },
});

app.component('navbar-component', NavbarComponent);

app.use(router);
app.mount('#app');
