# treats

## Goal
Create _something_ that 
1. Is the only place I need to look for the internet-content I may be interested in
2. Displays this internet-content in a way that conveys which content is likely more important to me at the moment

## Goal but more words

> 1. Is the only place I need to look for the internet-content I may be interested in

I know I have a lot of things I could be doing, or reading, or watching, or programming, or whatever, at any given time, but there are so many places to find these things. Some examples of content I specifically may be interested in...

1. Trello - Where I keep my To-Do list, save articles I want to read, save albums I want to listen to, keep a list of things I should look into buying, and a bunch of other stuff.
2. Twitch - Watching streams
3. Youtube - Watching videos
4. Twitter - Reading stuff I don't need to be reading
5. Reddit - Tech news, sports discussion, random meme garbage
6. Various websites - Tech news websites, programmer blog posts, various other things that fit in an RSS format

And a ton of other things I want to be able to know about without having to navigate to X number of places. I would like to create a single source of truth for any internet content I may be interested in.

> 2. Displays this internet-content in a way that conveys which content is likely more important to me at the moment

All of the things I listed (and forgot to list) in #1 result in a _lot_ of items to look at. I'd like this new tool to be able to display these different types of content in order from what is likely most important to me at the time, to what is least likely to be important.

How might it do this? The modules themselves (Trello, Reddit, Twitch, etc) can notify the app of how imporant it thinks it is. 

Take for instance a potential Twitch module. If someone I'm following is currently streaming, the Twitch module may have a medium importance. If no one I know is streaming, the Twitch module can still suggest streams I might want to watch, but may also have a lower importance. If I have configured the Twitch module with a list of Twitch streamers that I know I always want to be watching if they're streaming, and one of those users is streaming, it may set itself to a high importance.

You can imagine what kinds of rules each of the other kinds of modules may use to determine its respective importance. 

## Solution

### Treat
Content is exposed via Treats (hence the project name), which are just logical groupings of content. Treats determine a set of Treat Items, and then score those items to designate the importance of those items. Some examples of Treats may be...

- An 'RSS' Treat, that allows you to subscribe to multiple RSS feeds. Some potential configuration options for determing score: Specifying certain RSS that are more important than the others, a keyword matcher that adjusts the score of RSS items whose text content matches a certain keyword

- A 'Trello' Treat, that exposes certain cards on your Trello boards as Treat items. You could configure the Treat to return cards on  your "To-Do" board that are overdue, or have recent comments on them. Or configure your "Albums I Want to Listen To" board to randomly give you an album to listen to every once in awhile. 

- A 'Reddit' Treat, similar to the RSS feed in terms of configuration, but from Reddit instead of RSS.

- A sports treat, that posts sports scores and ongoing games as Treat items. You could configure it with your favorite teams, so that if your favorite teams were currently playing, it could create an item with a very high importance since you probably want to know about it if you don't already.

- A 
