export const itemStruct = {
    name: "itemname", // is also the image name
    dn: "Item Name",
    itemCateg: "consumable",//equipable,sellable(for item looted),consum(buffs/potions)
    itemType: "sword", // sword/staff/spear/Pauldrons//armor/greaves
    capabilities: { dmg: 100, def: 100, magic: 100, plusStr: 0, plusDex: 0, plusInt: 0}, //str(hp,dmg) // dex     
    equiped: false,
    soulFeed: 0,
    enhancedLevel: 0,
    durability: { current: 100, max: 100},
    price: 1000,
    desc: "This is description"
}