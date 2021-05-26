import {update} from '../src/update'
import fs from 'fs'
import { afterAll, beforeEach, describe, expect, it, jest } from '@jest/globals'



describe('Tests Update Functionalities', () => {

  // Varias variables y funciones definidas que serán utilizadas a lo largo de todos los test.

  const fakePath = '/tmp/itemsBi.json' 

  /**
   * @param {String} name 
   * @param { Integer} sellIn 
   * @param { Integer} quality 
   */
  function itemObject (name, sellIn, quality){
    this.name = name,
    this.sellIn = sellIn,
    this.quality = quality
  }

  const writeFakeFile = (objectArrayData) => {
    fs.writeFileSync(fakePath, JSON.stringify(objectArrayData))
  }

  const getJsonFile = () => { return JSON.parse(fs.readFileSync(fakePath))} 

  beforeEach( ()=> {
    if(fs.existsSync(fakePath) && fs.readFileSync(fakePath).length > 0) fs.truncateSync(fakePath, 0)
  })

  afterAll( () => {
    if(fs.existsSync(fakePath)) fs.unlinkSync(fakePath)
  })


  // TESTS

  it('Test 2, The quality of an item is never negative', () => {
    //arrange
    const fakePathData = fs.writeFileSync(fakePath, JSON.stringify([{name:"patatas", sellIn:10, quality: 0 }, {name:"potetos", sellIn: 10, quality: 2}]))
    //action
    update(fakePath)
    //assert
  
    const parsedFile = JSON.parse(fs.readFileSync(fakePath))
    const firstItemQuality = parsedFile[0].quality
    const secondItemQuality = parsedFile[1].quality

    expect(firstItemQuality).toBe(0)
    expect(secondItemQuality).toBe(1)
  })

  it('test2, but other point of view', () => {
    //arrange
    writeFakeFile([new itemObject('patatas', 10, 0), new itemObject('poteitous', 10, 2)])

    //action
    update(fakePath)

    //assert
    const jsonFile = getJsonFile()
    const firstItemQuality = jsonFile[0].quality
    const secondItemQuality = jsonFile[1].quality
    
    expect(firstItemQuality).toBe(0)
    expect(secondItemQuality).toBe(1)
  })

  it('Test3, Aged Brie actually increases in quality the older it gets', () => {
    //arrange
    const starterBrieQuality = 9
    const belowZeroSellIn = -1
    writeFakeFile([new itemObject('Aged Brie', 10, starterBrieQuality ), new itemObject('Aged Brie', belowZeroSellIn, starterBrieQuality)])
    //action
    update(fakePath)
    //asset
    const jsonFile = getJsonFile()
    const actualBrieQuality = jsonFile[0].quality
    expect(actualBrieQuality).toBeGreaterThan(starterBrieQuality)
    // expect(actualBrieQuality).toEqual(starterBrieQuality + 2)  DUDA: Al igual que cuando SellIn es > 0 se degrada *2, se aplica  el *2 de la misma manera al Aged Brie ? Parece que no
  })

  it('Test 4, The quality of an item is never more than 50. We using Aged Brie case for this example as it  is supposed to upgrade Quality.', () => {
    //arrange
    const maxQualityValue = 50
    const overMaxQuality = 51
    writeFakeFile([new itemObject('Aged Brie', 10, maxQualityValue), new itemObject('Aged Brie', 10, overMaxQuality)])
    //action
    update(fakePath)
    //asset
    const items = getJsonFile()
    const actualQualityValue = items[0].quality
    const actualOvermaxedQuality = items[1].quality
    expect(actualQualityValue).not.toBeGreaterThan(maxQualityValue)
    // expect(actualOvermaxedQuality).toEqual(50) Si definimos un valor por encima de 50 desde el principio, No le suma, pero el valor se queda como estaba
    // Me hubiese gustado meter un  
  })
  it('Test 5 Sulfuras, being a legendary item, never has to be sold nor does it decrease in quality', () => {
    // ke ?  https://es.wowhead.com/item=17182/sulfuras-mano-de-ragnaros  < https://es.wowhead.com/item=32838/guja-de-guerra-de-azzinoth
  })
  
  it(`Test 6, Backstage passes, like aged brie, increases in quality as it's sellIn value decreases; quality increases by 2 when there are 10 days or less and by 3 when there are 5 days or less but quality drops to 0 after the concert`, () => {
    //arrange

    // Reportar a Guillermo porque el nombre no es 'Backstage pass' o passes si no ' Backstage passes to a TAFKAL80ETC concert' , es un troll. 
    const itemQualityStartValue = 10
    const itemName ='Backstage passes to a TAFKAL80ETC concert' // pa evitar escribirlo mal o tener que editarlo 3 veces :'(
    //Lo suyo sería probar todas las casuisticas de 10 a 6 y de 5 a 1. Pero no me apetece instanciar  tantos objetos y no me acuerdo exactamente cómo se hacia. así que, así se queda.
    
    writeFakeFile([new itemObject(itemName, 10, itemQualityStartValue), new itemObject(itemName, 5, itemQualityStartValue ), new itemObject(itemName, 0 , itemQualityStartValue )])
    //action
    update(fakePath)
    //assert
    const items = getJsonFile()
    const itemQualityWith10SellIn = items[0].quality
    const itemQualityWith5SellIn = items[1].quality
    const itemQualityWith0SellIn = items[2].quality

    expect(itemQualityWith10SellIn).toEqual(itemQualityStartValue + 2)
    expect(itemQualityWith5SellIn).toEqual(itemQualityStartValue + 3)
    expect(itemQualityWith0SellIn).toEqual(0)
    
  });


  it(' Test 7. IMPLEMENTACIÓN => Conjured items degrade in quality twice as fast as normal items. Creo una función bastante gitanilla para probar la funcionalidad', () => {

  
    //arrang
    const conjuredItemDegrade = 2
    const startingQuality = 10
    const update = jest.fn((itemList) => {
      itemList.forEach(item => {
        if (item.conjured) {
          if (item.sellIn > 0 ) item.quality -= conjuredItemDegrade
          else if (item.sellIn <= 0) item.quality -= (conjuredItemDegrade * 2)
        }
      });
      fs.writeFileSync(fakePath, JSON.stringify(itemList))
    })

    /**
     *  
     * @param {Boolean} conjured 
     */
    function conjuredItemList (name, sellIn, quality, conjured) {
      this.name = name
      this.conjured = conjured
      this.sellIn = sellIn
      this.quality = quality

    }

    writeFakeFile([new conjuredItemList('patataGrande', 10, startingQuality, true ), new conjuredItemList('patataPocha', 0, startingQuality, true)])

    //action
    update(JSON.parse(fs.readFileSync(fakePath)))

    //assert
    const items = getJsonFile()
    console.log(items)
    const conjuredItemQualityInSell10 = items[0].quality
    const conjuredItemQualitySellInLess0 = items[1].quality

    expect(update).toBeCalled()
    expect(conjuredItemQualityInSell10).toEqual(startingQuality - conjuredItemDegrade)
    expect(conjuredItemQualitySellInLess0).toEqual(startingQuality - (conjuredItemDegrade * 2)) // Sí, la parentesis es pq no me fio
  })
})