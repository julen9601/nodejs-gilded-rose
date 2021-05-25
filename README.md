# GildedRose kata in NodeJS (with a twist)

Hi and welcome to team Gilded Rose.

As you know, we are a small inn with a prime location in a prominent city ran by a friendly innkeeper named Allison.  We also buy and sell only the finest goods. Unfortunately, our goods are constantly degrading in quality as they approach their sell by date.

We have a system in place that updates our inventory for us. It was developed by a no-nonsense type named Leeroy, who has moved on to new adventures. Your task is to add the new feature to our system so that we can begin selling a new category of items.

First an introduction to our system:

- All items have a `sellIn` value which denotes the number of days we have to sell the item
- All items have a `quality` value which denotes how valuable the item is
- At the end of each day our system lowers both values for every item

Pretty simple, right? Well this is where it gets interesting:

- Once the `sellIn` days is less than zero, `quality` degrades twice as fast
- The `quality` of an item is never negative
- `Aged Brie` actually increases in `quality` the older it gets
- The `quality` of an item is never more than 50
- `Sulfuras`, being a legendary item, never has to be sold nor does it decrease in `quality`
- `Backstage passes`, like aged brie, increases in `quality` as it's `sellIn` value decreases; `quality` increases by 2 when there are 10 days or less and by 3 when there are 5 days or less but `quality` drops to 0 after the concert

We have recently signed a supplier of conjured items. This requires an update to our system:

- `Conjured` items degrade in `quality` twice as fast as normal items

Feel free to make any changes to the `update` method and add any new code as long as everything still works correctly. However, do not alter the `Item` class as that belongs to the goblin in the corner who will insta-rage and one-shot you as he doesn't believe in shared code ownership.

Just for clarification, an item can never have its `quality` increase above 50, however `Sulfuras` is a legendary item and as such its `quality` is 80 and it never alters.

Sources:
<https://github.com/guyroyse/gilded-rose-javascript>
<http://iamnotmyself.com/2011/02/13/refactor-this-the-gilded-rose-kata/>
<https://github.com/professor/GildedRose>

## The twist

This section describes the twist on this version of the kata. Spoilers ahead! Don't read it if you're trying to do the exercise for the first time:

<details>
  <summary>The twist :point_down:</summary>

This version of the GildedRose kata tries to reduce the surprise factor when one approaches the code for the first time and discovers that the program has no side-effects at all. This always felt counter-intuitive to me as a facilitator and confusing for people trying the exercise. 

I made the program read and write items in a JSON file and also output the changed items to the console to work around this. The rationale behind this is:
- One expects a shop's data to be backed in some form of storage, thus the JSON file
- One also expects some kind of output when running a program

The combination of these two changes presents the opportunity to approach testing the program through actual side-effects without having to change the implementation right off the bat. This also enables the facilitator to propose some challenging restrictions (some examples):
- First of all, no changes should be made to the original data file at `src/items.json`
- Testing through side-effects on the data file is not allowed
- Using a different set of items other than the ones at `src/items.json` is not allowed

For example, interacting with the JSON could be forbidden for the sake of the exercise, and then one could run the program seve
</details>

## Preparing your environment

You can skip steps 1 and 2 if your development environment already has NodeJS 15 set up. Check the [`.tool-versions`](.tool-versions) file to know the specific NodeJS version this repo requires.

1. Install [asdf](https://asdf-vm.com/)
2. Add the NodeJS plugin to asdf with `asdf plugin add nodejs`
3. Fork this repo, clone it somewhere in your computer, and run `asdf install` and `npm install` where you cloned it.
4. Test your environment by running the tests with `npm run test`
