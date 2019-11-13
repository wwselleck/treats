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
Content is exposed via a Treat (hence the project name), which is just a logical grouping of content and associated configuration. Treats determine a set of Treat Items upon request, and then score those items to designate the importance of those items. Some examples of Treats may be...

- An 'RSS' Treat, that allows you to subscribe to multiple RSS feeds. Some potential configuration options for determing score: Specifying certain RSS that are more important than the others, a keyword matcher that adjusts the score of RSS items whose text content matches a certain keyword

- A 'Trello' Treat, that exposes certain cards on your Trello boards as Treat items. You could configure the Treat to return cards on  your "To-Do" board that are overdue, or have recent comments on them. Or configure your "Albums I Want to Listen To" board to randomly give you an album to listen to every once in awhile. 

- A 'Reddit' Treat, similar to the RSS feed in terms of configuration, but from Reddit instead of RSS.

- A sports Treat, that posts sports scores and ongoing games as Treat items. You could configure it with your favorite teams, so that if your favorite teams were currently playing, it could create an item with a very high importance since you probably want to know about it if you don't already.

- A stocks Treat, configured with stocks you want to be alerted about, whose score is affected by the % change that day

### Treat Item
As mentioned before, Treats output a list of Treat Items, which are just individual items of content. They might be equivalent to an RSS item, or a sports score, or a Twitch stream, or a stock ticker, etc. They would contain some standard base information, like title, description, url, score, etc., and then possibly some Treat-specific info. 

### Treat Item "Filters"
On top of the logic built in to each Treat that determines each Item's initial score, users should be able to add their own "filters" for which items are important, and those that aren't. These filters would accept Treat Items and some configuration, and would output Treat Items, modifying them in some way. They could adjust item's scores, they could add items, remove items, combine items, whatever. These filters could also be general, i.e. usable by all Treats, or Treat-specific. 

> As an aside, I don't think the name "filters" is very accurate for what I'm trying to describe. "Filter" implies that it accepts X items, and returns <= X items, not modified. These Treats filters could return any number of Treat Items, and those Items could be modified from the version that was passed to the filter. But for now, I'll refer the them as filters until I think of a better name.

Some examples of filters might be...

- A "keywords" filter that increases or decreases an item's score by a certain amount if its title or description contains a specified keyword(s). 
- A Reddit-specific filter, that filters out posts made by certain Reddit users. 
- A date filter, that applies a general multiplier to items based on how recent they are.

> As I'm typing this out, I'm realizing that Treat-specific filters may be better suited as being represented in the same way that general Treat configuration is. They may have a conceptual difference, but to the user they could be seen as the same thing, and be confused as to why they're displayed differently. 


```
+----------------------+    +----------------------+    +----------------------+                       +----------------------+
|                      |    |                      |    |                      |                       |                      |
|                      |    |                      |    |                      |                       |                      |
|     RSS Treat 1      |    |     Twitch Treat     |    |     Reddit Treat     |                       |     RSS Treat 2      |
|                      |    |                      |    |                      |                       |                      |
|                      |    |                      |    |                      |                       |                      |
+-----------+----------+    +-----------+----------+    +------------+---------+                       +-----------+----------+
            |                           |                            |                                             |
            |                           |                            |                                             |
            |                           |              +-------------+----------+                                  |
            |                           |              |                        |                                  |
            |                           |              | Reddit-Specific Filter |                                  |
            |                           |              |                        |                                  |
            |                           |              +-------------+----------+                                  |
            |                           |                            |                                             |
            |                           |                            |                                             |
            |                           |                            |                                             |
            |                           |                            |                                             |
            +--------------------------------------------------------+                                             |
                                        |                                                                          |
                                        |                                                                          |
                                        |                                                                          |
                                        v                                                                          |
            +---------------------------+----------------------------+                                             |
            |                                                        |                                             |
            |                        Filter 1                        |                                             |
            |                                                        |                                             |
            |                                                        |                                             |
            +---------------------------+----------------------------+                                             |
                                        |                                                                          |
                                        |                                                                          |
                                        |                                                                          |
                                        +---------------------------+  +-------------------------------------------+
                                                                    |  |
                                                                    |  |
                                                                    |  |
                                                                    v  v
                                          +-------------------------+--+---------------------------+
                                          |                                                        |
                                          |                        Filter 2                        |
                                          |                                                        |
                                          |                                                        |
                                          +---------------------------+----------------------------+
                                                                      |
                                                                      |
                                                                      |
                                                                      |
                                                                      |
                                                                      v
                                                                    OUTPUT


```

### Treat Item Views
I'm not going to get too specific on what the exact front-end for Treats is going to look like (mainly because I haven't thought that much about it), but there's one feature I'm making an initial goal of the project: Treat-Specific Views.

Something like an RSS reader will only show you so much. It'll give you the title, description, and link of the RSS item, and then normally upon expansion, it will show the content of the URL, if it's able to find it. 

In Treats, the front-end should contain Treat-specific components, that are capable of rendering more interesting "previews" of content. For example, a sports Treat Item could contain the score of a game going on, and upon expansion could show an interactive box score, and maybe even search Twitter for the top Tweets related to that game.

This is something I'll write more about as I get closer to implementing a front-end. For now, it's an idea.

## Implemenation
### Server
#### Technologies
Language: Go
Database: Mongo
#### Models
A TreatDefinition is a definition of a source for Treat Items. 
```
{
  id: String 
  name: String

}
```

##### Treat
A Treat is a source of TreatItems
```
{
  id: String
  // A Treat can provide its own configOptions, and then be
  // used as the Parent of another Treat, which then provides
  // values for those config options.
  idParent?: String
  config: {
    [optionName: String]: JSONValue
  },
  configOptions?: {
    [optionName: String]: {
      optionName: String
      type: String
    }
  }
}
```

##### TreatItem
A TreatItem is an item of content. 
```
{
  id: String
  title: String
  description?: String
  link?: String
  score: Int # The "importance" of this item, between 0-1000
  info?: Object # A Treat-specific object to store any extra data about the item
}
```

#### API Endpoints
##### Treats
**GET /treat**
Get a list of all available Treats

*Response*
```
[<Treat>]
```

**POST /treat**
Create a Treat

*Payload*
```
{
  // For now, new Treats can only be created using a base Treat 
  // that already exists locally. In the future, Treats may be able to be created
  // using for instance a URL, that hits an HTTP server that serves TreatItems
  idParent: String
  config?: {
    [optionName: String]: JSONValue
  }
}
```


**GET /treat/:idTreat**
Get specific Treat

**GET /treat/:idTreat/items**
Fetch the TreatItems for a Treat

##### User Management and Configuration
**POST /user/:idUser**
### Client
## FAQ (frequently asked by me, to myself)

## Milestones

### Milestone 1
For this milestone, the base Parent Treats can be hard-coded, either in the database, directly in the source code, or whatever.  

- [ ] RSS Parent Treat
- [ ] Twitch Parent Treat
- [ ] Reddit Parent Treat

For this milestone, all treats will be globally accessible. Users and permissions will not exist.

- [ ] GET /treat 
- [ ] POST /treat
- [ ] GET /treat/:idTreat
- [ ] GET /treat/:idTreat/items


