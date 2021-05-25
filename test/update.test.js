import {update} from '../src/update'
import fs from 'fs'
import { afterAll, beforeEach, describe, expect, it } from '@jest/globals'



describe('Tests Update Functionalities', () => {
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
    if(fs.readFileSync(fakePath)) fs.unlinkSync(fakePath)
  })

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
    writeFakeFile([new itemObject('Aged Brie', 10, starterBrieQuality )])
    //action
    update(fakePath)
    //asset
    const jsonFile = getJsonFile()
    const actualBrieQuality = jsonFile[0].quality
    expect(actualBrieQuality).toBeGreaterThan(starterBrieQuality)
  })
})