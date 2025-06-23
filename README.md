# WordPress to Next.js blog migration
I used Cursor to migrate [my blog](https://github.com/ericdodds/eric-dodds-blog) from WordPress to Next.js. This is a Cursor-generated, edited overview of the process and the scripts used. You can use Cursor to run the process yourself, but will likely save even more time by giving the LLM the full context of my blog repo and this migration repo. 

I also [wrote a blog post](https://www.ericdodds.com/blog/migrating-my-wordpress-blog-to-nextjs-and-vercel?utm_source=github-migration-repo) about the migration that includes more detail on history and process, including trickiest edge cases I faced. 

## Overview

This guide documents the successful migration of a WordPress blog with 230+ posts to a Next.js application using the Vercel Blog Starter template. The migration involved converting WordPress XML exports to MDX files while preserving formatting, images, footnotes, and internal links.

## Migration Requirements

### Essential files
- **WordPress XML export**: Complete content export including all posts, pages, and metadata
- **Full site export, including media**: Full WordPress site download containing `/wp-content/uploads/` directory
- **WordPress site access**: I recommend doing this while your site is still running so that you can download missing images and media files if needed

### Key Challenges Addressed
- Converting WordPress HTML to clean Markdown/MDX
- Preserving footnotes and internal links (I used a custom footnotes plugin)
- Handling image paths and missing media files
- Maintaining post metadata and publication dates
- Cleaning up WordPress-specific formatting artifacts

## Migration Steps & Edge Cases

### 1. Content Export & Analysis
- Export WordPress XML with full content
- Download complete WordPress site for media files
- Analyze content structure and identify edge cases
- Map WordPress categories to MDX frontmatter

### 2. Content Conversion
- Convert WordPress HTML to Markdown using [Turndown](https://github.com/mixmark-io/turndown)
- Handle WordPress-specific formatting (blockquotes, lists, etc.)
- Preserve footnotes and their backlinks
- Convert internal WordPress links to relative paths

### 3. Media File Management
- Map WordPress media URLs to local file paths
- Download missing images from live WordPress site
- Organize images in `/public/images/blog/[post-slug]/` structure
- Update image references in MDX content

### 4. Content Cleanup
- Remove spam links injected by crawlers (curse WordPress security problems)
- Fix broken internal links
- Clean up malformed HTML artifacts
- Standardize image formatting

### 5. Validation & Testing
- Verify all posts render correctly
- Check internal link functionality
- Validate image loading
- Test responsive design

## Migration Scripts

### Core Migration Scripts

#### `migrate-wordpress.js`
**Purpose**: Main orchestration script for the entire migration process - I initially used the `migrate-single-post.js` script to test, then updated the main script as edge cases were solved

**Key Functions**:
- Parses WordPress XML export
- Converts HTML content to Markdown using Turndown
- Generates MDX files with proper frontmatter
- Handles post metadata (title, date, categories, summary)
- Creates directory structure for posts and images
- Downloads and processes featured images

**Usage**:
```bash
npm run migrate:wordpress
```

#### `fetch-wordpress-posts.js`
**Purpose**: Downloads individual posts from live WordPress site for analysis

**Key Functions**:
- Fetches post content via WordPress REST API
- Extracts clean HTML content
- Identifies missing media files
- Creates backup of original content

**Usage**:
```bash
npm run migrate:fetch
```

#### `analyze-wordpress-content.js`
**Purpose**: Analyzes WordPress content structure and identifies patterns

**Key Functions**:
- Examines post formatting patterns
- Identifies common HTML structures
- Maps WordPress categories and tags
- Generates content statistics
- Helps identify edge cases for conversion

**Usage**:
```bash
npm run migrate:analyze
```

### Content Processing Scripts

#### `migrate-single-post.js`
**Purpose**: Migrates individual posts for testing and debugging

**Key Functions**:
- Processes single post conversion
- Allows testing of conversion logic
- Useful for debugging edge cases
- Validates output before full migration

**Usage**:
```bash
npm run migrate:single [post-slug]
```

### Link & Content Fix Scripts

#### `fix-internal-links.js`
**Purpose**: Repairs broken internal links after migration

**Key Functions**:
- Scans all MDX files for internal links
- Updates WordPress permalinks to new structure
- Fixes relative path issues
- Validates link integrity

**Usage**:
```bash
npm run fix:internal-links
```

#### `fix-blog-links.js`
**Purpose**: Cleans up blog-specific link formatting

**Key Functions**:
- Standardizes blog link formatting
- Removes WordPress-specific link attributes
- Ensures consistent link styling
- Fixes malformed link structures

**Usage**:
```bash
npm run fix:blog-links
```

#### `clean-spam.js`
**Purpose**: Removes spam links injected by crawlers during WordPress hosting

**Key Functions**:
- Scans all MDX files for external inline links
- Identifies spam links based on patterns (external links in posts that also use footnotes)
- Distinguishes between legitimate external links and injected spam
- Removes malicious or unwanted external links while preserving legitimate content
- Generates a report of removed links for review

**Usage**:
```bash
npm run clean-spam
```

### Image Management Scripts

#### `download-remaining-images.js`
**Purpose**: Downloads missing images from live WordPress site

**Key Functions**:
- Scans MDX files for image references
- Identifies missing local image files
- Downloads images from WordPress site
- Organizes images in proper directory structure
- Updates image paths in content

**Usage**:
```bash
npm run download-remaining-images
```

## Key Technical Decisions

### Content Conversion Strategy
- Used Turndown for HTML-to-Markdown conversion
- Preserved footnotes using [remark-footnotes](https://github.com/remarkjs/remark-footnotes) plugin
- Maintained WordPress post structure and metadata
- Converted WordPress categories to MDX frontmatter

### Image Handling
- Downloaded complete WordPress media library
- Organized images by post slug for easy management
- Used Next.js Image component for optimization
- Maintained original image filenames for consistency

### Link Management
- Converted WordPress permalinks to relative paths
- Preserved internal blog references
- Cleaned up external spam links
- Maintained footnote backlinks

## Post-Migration Cleanup

After successful migration, the following cleanup was performed:
- Removed migration dependencies (`turndown`, `xml2js`)
- Deleted migration scripts from `package.json`
- Cleaned up temporary files and directories
- Updated README with migration documentation

## Results

The migration successfully converted:
- 230+ blog posts from WordPress to MDX
- Preserved all formatting, footnotes, and internal links
- Maintained complete image library
- Kept all post metadata and publication dates
- Achieved significant performance improvements