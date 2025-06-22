const fs = require('fs');
const path = require('path');

const postsDir = './app/blog/posts';

// URL to slug mapping - maps old WordPress URLs to actual MDX file slugs
const urlToSlugMap = {
  'letters-company-disagreements': 'letters-to-the-company-disagreements',
  'dont-keep-up-with-news': 'two-quotes-about-news-or-why-i-dont-keep-up',
  'dictionary-apps-unfortunate-typeface': 'dictionaryapps-unfortunate-typeface',
  'a-kid-a-jeep-and-the-meaning-of-greatness': 'a-kid-a-jeep-and-the-meaning-of-greatness',
  'email-signatures-onboarding-authority': 'email-signatures-onboarding-and-perception-of-authority',
  'bookless-libraries-democratize-information': 'bookless-libraries-and-the-democratization-of-information',
  'libraries-consume-create': 'libraries-from-consume-to-create',
  'series-productivity-hacking': 'productivity-hacking-introduction',
  'series-from-maker-to-manager': 'from-maker-to-manager',
  'series-making-it-count': 'making-it-count-introduction',
  'series-is-an-online-presence-mandatory': 'is-an-online-presence-mandatory-part-1-social-consequences',
  'series-quick-observations-on-services-businesses': 'quick-observations-on-services-businesses-part-1-scaling-is-completely-different',
  'entrepreneurial-or-enterprising': 'entrepreneurial-or-enterprising',
  'the-challenge-of-not-having-a-challenge': 'the-challenge-of-not-having-a-challenge',
  'inevitable-ubiquity-web': 'the-inevitable-ubiquity-of-the-web',
  'making-it-count-steward-time-attention-technology': 'making-it-count-how-i-steward-time-attention-and-technology',
  'chaos-behind-the-magic': 'chaos-behind-the-magic',
  'solving-scale-hard-every-size': 'solving-scale-is-hard-at-every-size',
  'its-the-customers-story': 'its-the-customers-story-not-yours',
  'why-footnotes': 'why-footnotes',
  'productivity-requires-harnessing-focus': 'productivity-requires-harnessing-focus',
  'productivity-requires-removing-distractions': 'productivity-requires-removing-distractions',
  'making-it-count-distraction-is-the-enemy': 'making-it-count-distraction-is-the-enemy',
  'making-it-count-how-i-consume-the-internet': 'making-it-count-how-i-consume-the-internet',
  'too-busy-cop-out-excuse': 'because-im-too-busy-as-a-cop-out-excuse',
  'distraction-a-good-thing': 'from-the-comments-can-distraction-be-a-good-thing',
  'what-apps-on-iphone': 'what-apps-are-on-my-iphone',
  'dont-keep-up-with-news': 'two-quotes-about-news-or-why-i-dont-keep-up',
  'making-it-count-introduction': 'making-it-count-introduction',
  'making-it-count-sleep-exercise-and-diet-as-the-foundations-of-energy': 'making-it-count-sleep-exercise-and-diet-as-the-foundations-of-energy',
  'values-beliefs-and-precious-hours': 'making-it-count-values-beliefs-and-precious-hours',
  'managing-up': 'managing-up',
  'first-know-thyself': 'first-know-thyself',
  'myths-of-productivity-finding-the-right-tools': 'myths-of-productivity-finding-the-right-tools',
  'productivity-hacking-what-would-you-do-with-more-time': 'productivity-hacking-what-would-you-do-with-more-time',
  'productivity-hacking-notifications-as-distraction-by-default': 'productivity-hacking-notifications-as-distraction-by-default',
  'productivity-hacking-is-not-intuitive': 'productivity-hacking-is-not-intuitive',
  'productivity-hacking-what-snake-oil-looks-like': 'productivity-hacking-what-snake-oil-looks-like',
  'threads-of-belief': 'making-it-count-threads-of-belief-questions-and-answers',
  'on-following-your-passion-part-1': 'on-following-your-passion-part-1',
  'the-window-seat': 'the-window-seat',
  'maine-mountains-2012': 'maine-mountains',
  'facebook-photos-privacy-and-parenthood': 'facebook-photos-privacy-and-parenthood',
  'maciej-ceglowski-on-the-danger-of-data': 'maciej-ceglowski-on-the-danger-of-data',
  'crisis-separates-leaders': 'crisis-separates-leaders',
  'happy-92nd-papa': 'happy-92nd-papa',
  'budgeting-software-hunt': 'on-the-hunt-for-new-budgeting-software',
  'selling-worth-investment': 'is-what-you-are-selling-worth-the-investment',
  'what-to-expect': 'what-to-expect-from-this-blog',
  'should-you-get-an-mba': 'should-you-get-an-mba',
  'from-the-comments-is-it-wrong-or-selfish-of-people-to-crave-fulfillment': 'from-the-comments-is-it-wrong-or-selfish-of-people-to-crave-fulfillment',
  'rewind-creation-chaotic-residue-1': 'rewind-creation-and-chaotic-residue-part-1',
  'the-internet-as-a-giant-echo-chamber-for-individuals': 'the-internet-as-a-giant-echo-chamber-for-individuals',
  'testing-un-tailored-search-duck-duck-go': 'testing-un-tailored-search-with-duckduckgo',
  'higher-ed-revolution': 'national-affairs-on-the-coming-higher-ed-revolution',
  'life-not-ceteris-perebus': 'life-isnt-ceteris-peribus',
  'who-designed-these-restroom-icons': 'who-designed-these-restroom-icons',
  'yo-and-the-fallacy-of-all-technology-as-good': 'yo-and-the-fallacy-of-all-technology-as-good',
  'the-amazing-marketingsales-funnel': 'the-amazing-marketingsales-funnel',
  'airplane-propellers-perfect-v1': 'airplane-propellers-as-a-nearly-perfect-version-one',
  'ux-fail-ice-cream': 'user-experience-fail-no-ice-cream-for-you',
  'pirate-site-of-sea': 'a-pirate-needs-the-sight-of-the-sea',
  'photos-las-vegas': 'a-few-photos-from-vegas'
};

// Function to convert incorrect blog slug to correct slug
function convertToCorrectSlug(slug) {
  // Check if we have a mapping for this slug
  const mappedSlug = urlToSlugMap[slug];
  if (mappedSlug) {
    return mappedSlug;
  }
  
  // If no mapping, use the original slug
  return slug;
}

// Function to process a single file
function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;
  let changes = [];
  
  // Regex to match markdown links with /blog/ URLs that might have incorrect slugs
  const linkRegex = /\[([^\]]+)\]\(\/blog\/([^)]+)\)/g;
  
  let newContent = content.replace(linkRegex, (match, linkText, slug) => {
    // Check if this slug needs to be corrected
    const correctSlug = convertToCorrectSlug(slug);
    
    if (correctSlug !== slug) {
      const newLink = `[${linkText}](/blog/${correctSlug})`;
      
      changes.push({
        from: match,
        to: newLink,
        slug: slug,
        correctSlug: correctSlug
      });
      
      modified = true;
      return newLink;
    }
    
    return match; // Keep original if no change needed
  });
  
  // Also handle plain URLs in text (not in markdown links)
  const plainUrlRegex = /\/blog\/([^\s\)]+)/g;
  
  newContent = newContent.replace(plainUrlRegex, (match, slug) => {
    // Check if this slug needs to be corrected
    const correctSlug = convertToCorrectSlug(slug);
    
    if (correctSlug !== slug) {
      const newUrl = `/blog/${correctSlug}`;
      
      changes.push({
        from: match,
        to: newUrl,
        slug: slug,
        correctSlug: correctSlug
      });
      
      modified = true;
      return newUrl;
    }
    
    return match; // Keep original if no change needed
  });
  
  if (modified) {
    fs.writeFileSync(filePath, newContent, 'utf-8');
    console.log(`✅ Updated ${filePath}`);
    changes.forEach(change => {
      console.log(`  🔄 /blog/${change.slug} → /blog/${change.correctSlug}`);
    });
  }
  
  return { modified, changes };
}

// Main function
function fixBlogLinks() {
  console.log('🔧 Fixing incorrect /blog/ links in blog posts...\n');
  
  const files = fs.readdirSync(postsDir)
    .filter(file => file.endsWith('.mdx'))
    .map(file => path.join(postsDir, file));
  
  let totalFiles = 0;
  let modifiedFiles = 0;
  let totalChanges = 0;
  
  files.forEach(file => {
    totalFiles++;
    console.log(`Processing: ${path.basename(file)}`);
    
    const result = processFile(file);
    if (result.modified) {
      modifiedFiles++;
      totalChanges += result.changes.length;
    }
    console.log(''); // Empty line for readability
  });
  
  console.log('📊 Summary:');
  console.log(`  Total files processed: ${totalFiles}`);
  console.log(`  Files modified: ${modifiedFiles}`);
  console.log(`  Total link changes: ${totalChanges}`);
  console.log('\n✅ Blog link fix complete!');
}

// Run the script
if (require.main === module) {
  fixBlogLinks();
}

module.exports = { fixBlogLinks, convertToCorrectSlug }; 