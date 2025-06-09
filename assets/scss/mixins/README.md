# SCSS Mixins Directory

This directory contains modular SCSS mixins organized by functionality. These mixins provide consistent styling and behavior across the site.

## Directory Structure

- `_animations.scss`: Animation-related mixins (keyframes, transitions, transforms)
- `_effects.scss`: Visual effects like shadows and gradients
- `_components.scss`: UI component mixins like buttons and cards
- `_responsive.scss`: Responsive breakpoint mixins for consistent media queries
- `_index.scss`: Forwards all mixins for easy importing

## How to Use

### Option 1: Import all mixins at once

```scss
@use "mixins";

.my-element {
  @include mixins.box-shadow(false, 5px, 5px, 5px);
}
```

### Option 2: Import specific mixin files

```scss
@use "mixins/effects";
@use "mixins/responsive";

.my-element {
  @include effects.box-shadow(false, 5px, 5px, 5px);
  
  @include responsive.mobile {
    // Mobile-specific styles
  }
}
```

## Breakpoints

The responsive mixins use the following breakpoints:

- `mobile`: max-width 640px
- `tablet`: 641px to 768px
- `desktop`: 769px to 1024px
- `widescreen`: 1025px to 1216px
- `fullhd`: 1217px and above

You can also use the custom breakpoint mixin:

```scss
@include mixins.breakpoint(560px, 1024px) {
  // Styles for viewport width between 560px and 1024px
}
```
