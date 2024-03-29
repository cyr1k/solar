# Straight Up Solar Exercises

## "Request A Quote" Form Analysis
> Go to https://straightupsolar.com/request-a-quote/.  What additional metadata (or new fields), beyond the fields displayed, would you want to capture for downstream use by the IT team?  Describe how you would make use of the additional data in a paragraph or two.  (Hint: Focus on data needed for database integrity, search functionality, artificial intelligence applications, etc.)

Many considerations exist in the design of a "request for quote" form for the purposes of lead generation.  It is ultimately a collaborative effort between IT, Sales, and Analytics teams, with some compromises necessary on all sides.  Above all, the form should be brief and intuitive to avoid "drop-off"; many potential customers will be taking a shotgun approach to project bids and will simply move on to the next Google result if one company's form looks too involved.  Data integrity is a very real issue, but "bad" data can be mitigated, corrected, and expanded -- a total lack of data cannot.  

To some extent, I feel like this is a "trick question".  As a mock user and a developer, I can tell that a good deal of thought has already gone into this form.  It is in line with most top Google results for "solar quote", perhaps slightly longer than average.  While it is tempting to add fields for things like budget, company size, utility provider, annual power usage, and so on, doing so would risk drop-off. Furthermore, these data points will, in theory, soon be ascertained more accurately by the agent working with the lead.

In terms of metadata, it seems that you are already implementing most of what I would suggest.  I think it's safe to say that you are already collecting the low-hanging fruit such as IP addresses and referrers.  I experimented with the site under different computers/browser configurations (without ever submitting the form). Looking through traffic logs, I see that you are employing several trackers, including Google, Bing, Facebook, and CallRail.  Analyzing the responses from these trackers, I see that (across sessions) I have been fingerprinted, located, and categorized as a prospective residential customer in St. Louis, which is accurate.  I would venture to guess that you are tying these fingerprints and demographics to the actual form submission and that they make their way into your dataset / CRM.  Tracking metadata is a valuable tool for data integrity, targeted ads, and other applications, but many users (such as myself) will be using various forms of tracking protection, so trackers should not be overly relied upon.

With that said, and without knowing the specifics of your CRM, data integrity issues, and lead conversion workflows, I do have a few suggestions, roughly in order of importance / practicality:  

1. __Split the "Full Name" field into "First Name" and "Last Name".__  
   _From experience, I know name parsing is not as trivial as it seems. Users are unlikely to see the extra field as an undue burden.  Many will be using their browser's autofill feature, which is more likely to have these fields mapped than "Full Name".  This suggestion would aid in identifying duplicate leads and generating convincing personalized follow-ups._
2. __Leverage Google APIs (or equivalent) to auto-suggest address fields.__  
   _This would be convenient for the user and would standardize addresses to improve data integrity.  Additionally, it would likely better enable you to automatically gather valuable data about the nature of the residence/business at that address before point of contact.  At minimum, I would suggest moving the zip code field before the city/state and having the latter fields be populated from the former.  In any implementation, the user should be able to override suggestions since address APIs are imperfect._ 
3. __A "Have you worked with us before?" field (default false).__  
   _Most users would simply ignore it, but the field would probably be worthwhile to flag potential duplicate leads as early as possible._
4. __(If not already doing so), implement automated data cleanup CRM solutions.__  
   _No matter how thoughtful the input form, edge cases and user error are facts of life.  One of my very first professional development projects involved a SalesForce lead database with massive data integrity issues.  After analyzing the issues, I implemented some relatively simple automated mitigators such as parsing the email domain, standardizing addresses, and making some optional fields mandatory for agents.  Even these unsophisticated solutions went a long way in preventing bad data.  Depending on your specific needs and CRM environment, I might suggest looking into one of the many available commercial solutions, such as RingLead Prevent._ 
5. __Consider adding an optional 'Job Title' ComboBox for non-residential RFQ's.__  
   _This may or may not be worthwhile depending on the dynamics of your customer base, agent workload, etc.  It might be a nice data point to have for customer management and analytics purposes, especially if you have a lot of larger clients with many contacts.  I would assume that job title is already being logged by the agent at point of contact, so I think this suggestion is less important than others._

This was an interesting exercise to me.  I think that the form in its current state likely does its job well, but these suggestions are worth considering.  I would be interested to hear your thoughts about the design of the form, the nature of any data integrity issues, your CRM implementation, analytic strategies, and general customer conversion processes.  Thank you for enduring my wall of text; I feel that I may have risked drop-off :)

## GitHub / Example Code
> If you have a GitHub (or similar) account, provide a link to a project there that you’d like to share with us.  If you do not have a GitHub account, please share a coding sample with us sized around 50 - 200 lines of code.  In addition to the code, please write a paragraph or two describing what the code does.

My github can be found [here](https://www.github.com/cyr1k/).  I recently added some of my old FrontEnd work from [CodePen](https://codepen.io/zedri) to my  [Gists](https://gist.github.com/cyr1k).  I added a couple old semi-professional projects; after 3 years of professional employment, there are a lot of things I would have done differently on these, and I think that's a good thing!


Finally, I wrote [a sample project called 'Solar Solver'](https://github.com/cyr1k/str8up/tree/main/solar_solver) specifically for this exercise.  Commentary is below.

## Solar Solver Commentary

In order to demonstrate my web development abilities and my interest in the subject matter, I developed a frontend for NREL's PVWatts calculator, which allows users to estimate how much a PV system would save them for a given location.  I used BootStrap and JQuery since I am familiar with these libraries and can see that you make use of them as well.  I leveraged Google's Maps/Places API to autocomplete addresses and allow users to see them on a familiar Maps UI.  My goal was for the form to be faster and more intuitive than NREL's official frontend, and though it is still rough around the edges, I think I have achieved that goal.

The problem with getting into a project that's actually fun / interesting is that it's hard not to be ambitious and excited about features (at some expense to code quality).  Although I don't think there is any truly egregious code, it still needs more work than I can deliver right now.  The code could stand to be refactored a bit, there are many features I would still like to implement, and many aspects of the code I would not consider ready for production (validation, error handling, user guidance, etc.).  It had been a while since I've done development of this nature and it was quite fun (and potentially actually useful to me) so I hope to expand on it outside of this exercise!

### How To Use
Clone repo and open SOLAR_SOLVER.HTML.  Input address and solar array info, then hit "Calculate!" button.  Results will appear below and can be saved as CSV/JSON via a button in the "Actions" sidebar.

### Dependencies
All dependencies should be handled via script links in SOLAR_SOLVER.HTML; no dependencies requiring setup (ie node modules) were used for the sake of simplicity when demoing the app. 
* BootStrap 5 Beta 3
* JQuery 3.6.0
* Google Maps/Places API (my key provided)
* NREL PVWatts API (my key provided)
### Known Issues
* Form fields lack validation
* Table generation in JS like this seems like a bad practice in the long run. Already kinda repetitive...
* Google Maps API Widget is sometimes a bit buggy when refreshing/selecting address
* Bootstrap Range Sliders seem to be a bit buggy
  * Mouse-over event handling on sliders to display current value is probably overly-expensive
  * Other CSS frameworks (IE MD-Bootstrap) have this feature implemented nicely natively

### Improvement Ideas
* An actual backend to store results
  * SQL, ORM, etc.
* Allow saving of specific reports instead of "all or nothing"
  * Possibly an Excel with multiple sheets?
* UI / UX Enhancements
  * Tooltips / Popups explaining each field
  * Make sections collapsible
    * Do it automatically as convenient per context
  * Button to clear all fields
  * Visualization of Radius/Azimuth
* Additional Pages
  * Battery Calculator
  * System Part Requirement Analyzer / Visualizer
  * Utility Cost Lookup
* Potentially Helpful Technologies
  * SASS / SCSS
  * Modern JS Framework (ie React)
  
### Screenshot
![Solar Solver Screenshot](./solar_solver/screenshot.png "Logo Title Text 1")