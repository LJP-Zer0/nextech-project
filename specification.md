# Specification: Cooking Recipe Keeper

App description: My app is for chef's and cooks who want to keep track of their recipes, ingredients and instructions of how to cook said recipes

## Style and Theme

The app should calm and professional but have a hint of fun and bold as to not look too boring but keep a easy to use and direct structure to not overwhelm the user 


Use the *style-guide.html* for details on styling -- fonts, colors, and layout.

## User Scenarios

### Story 1 (most important)

Bobby's mon wants to keep track of all her recipes and wants to keep a list of ingredients and an optional function of instructions of how to use the ingredients.

---

## Requirements

Write clear statements about what the app must do.

### Functional Requirements

1. The app must include these pages:
	 - Home (`#/`)
	 - Collection (`#/items`)
	 - Item detail (`#/items/:id`)
	 - About (`#/about`)
2. The navigation bar must let people move to Home, Items, and About.
3. The app must load data from `items-template.csv` (a simple text table file).
4. The collection page must show one card per row in the data file.
5. Each card must include name, short description, and image (if available).
6. Each card must include a way to open that item's detail page.
7. The detail page must show full information for one selected item.

### Key Data

Use this as the basic item shape from the current starter data file.

- Item
	- id
	- name
	- description
	- category
	- image_url
	- location

## Success Criteria

Describe what success looks like in simple, observable terms.

1. A new person can open the app and reach the collection page in one click from Home.
2. A new person can open one item detail page from the collection without help.
3. If the data cannot load, the app shows a clear message instead of a blank page.



### Starter defaults

The template starts with Bootstrap default styling (light background, blue primary, simple cards). You only need to describe the changes you want.

## Assumptions

- This is a beginner project for learning how to describe app behavior before generating code. It is a prototype, not a finished product.
- The app stays simple and uses one text table data file as its data source.
- The data may use placeholder images or no images at all. Use picsum.photos for any needed placeholder images.
- Styling remains based on Bootstrap classes already used in the starter project.
- The first version focuses on clarity and working basics, not advanced features.

## Notes for Students (How to Use This Template)

- Keep each section short and plain.
- Write for a classmate who is not technical.
- Focus on user actions and visible results.
- Start with Story 1 and only add extras if you have time.
