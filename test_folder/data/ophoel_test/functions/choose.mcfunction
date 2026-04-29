scoreboard objectives add Oph_ChooseVar_d1 dummy
summon minecraft:marker ~ ~ ~ {Tags:["Oph_ChooseMarker_d1", "Oph_ChooseMarker0_d1"]}
scoreboard players set @e[tag=Oph_ChooseMarker0_d1, type=minecraft:marker, sort=nearest, limit=1] Oph_ChooseVar_d1 0
summon minecraft:marker ~ ~ ~ {Tags:["Oph_ChooseMarker_d1", "Oph_ChooseMarker1_d1"]}
scoreboard players set @e[tag=Oph_ChooseMarker1_d1, type=minecraft:marker, sort=nearest, limit=1] Oph_ChooseVar_d1 1
summon minecraft:marker ~ ~ ~ {Tags:["Oph_ChooseMarker_d1", "Oph_ChooseMarker2_d1"]}
scoreboard players set @e[tag=Oph_ChooseMarker2_d1, type=minecraft:marker, sort=nearest, limit=1] Oph_ChooseVar_d1 2
summon minecraft:marker ~ ~ ~ {Tags:["Oph_ChooseMarker_d1", "Oph_ChooseMarker3_d1"]}
scoreboard players set @e[tag=Oph_ChooseMarker3_d1, type=minecraft:marker, sort=nearest, limit=1] Oph_ChooseVar_d1 3
summon minecraft:marker ~ ~ ~ {Tags:["Oph_ChooseMarker_d1", "Oph_ChooseMarker4_d1"]}
scoreboard players set @e[tag=Oph_ChooseMarker4_d1, type=minecraft:marker, sort=nearest, limit=1] Oph_ChooseVar_d1 4
summon minecraft:marker ~ ~ ~ {Tags:["Oph_ChooseMarker_d1", "Oph_ChooseMarker5_d1"]}
scoreboard players set @e[tag=Oph_ChooseMarker5_d1, type=minecraft:marker, sort=nearest, limit=1] Oph_ChooseVar_d1 5
summon minecraft:marker ~ ~ ~ {Tags:["Oph_ChooseMarker_d1", "Oph_ChooseMarker6_d1"]}
scoreboard players set @e[tag=Oph_ChooseMarker6_d1, type=minecraft:marker, sort=nearest, limit=1] Oph_ChooseVar_d1 6
summon minecraft:marker ~ ~ ~ {Tags:["Oph_ChooseMarker_d1", "Oph_ChooseMarker7_d1"]}
scoreboard players set @e[tag=Oph_ChooseMarker7_d1, type=minecraft:marker, sort=nearest, limit=1] Oph_ChooseVar_d1 7
summon minecraft:marker ~ ~ ~ {Tags:["Oph_ChooseMarker_d1", "Oph_ChooseMarker8_d1"]}
scoreboard players set @e[tag=Oph_ChooseMarker8_d1, type=minecraft:marker, sort=nearest, limit=1] Oph_ChooseVar_d1 8
summon minecraft:marker ~ ~ ~ {Tags:["Oph_ChooseMarker_d1", "Oph_ChooseMarker9_d1"]}
scoreboard players set @e[tag=Oph_ChooseMarker9_d1, type=minecraft:marker, sort=nearest, limit=1] Oph_ChooseVar_d1 9
summon minecraft:marker ~ ~ ~ {Tags:["Oph_ChooseMarker_d1", "Oph_ChooseMarker10_d1"]}
scoreboard players set @e[tag=Oph_ChooseMarker10_d1, type=minecraft:marker, sort=nearest, limit=1] Oph_ChooseVar_d1 10
summon minecraft:marker ~ ~ ~ {Tags:["Oph_ChooseMarker_d1", "Oph_ChooseMarker11_d1"]}
scoreboard players set @e[tag=Oph_ChooseMarker11_d1, type=minecraft:marker, sort=nearest, limit=1] Oph_ChooseVar_d1 11
summon minecraft:marker ~ ~ ~ {Tags:["Oph_ChooseRes_d1"]}
scoreboard players set @e[tag=Oph_ChooseRes_d1, type=minecraft:marker, sort=nearest, limit=1] Oph_ChooseVar_d1 0
scoreboard players operation @e[tag=Oph_ChooseRes_d1, type=minecraft:marker, sort=nearest, limit=1] Oph_ChooseVar_d1 = @e[tag=Oph_ChooseMarker_d1, sort=random, limit=1] Oph_ChooseVar_d1
execute if score @e[tag=Oph_ChooseRes_d1, type=minecraft:marker, sort=nearest, limit=1] Oph_ChooseVar_d1 matches 0 run give @p diamond
execute if score @e[tag=Oph_ChooseRes_d1, type=minecraft:marker, sort=nearest, limit=1] Oph_ChooseVar_d1 matches 1 run give @p emerald
execute if score @e[tag=Oph_ChooseRes_d1, type=minecraft:marker, sort=nearest, limit=1] Oph_ChooseVar_d1 matches 2..11 run give @p dirt
kill @e[tag=Oph_ChooseMarker_d1, sort=nearest, limit=12]
kill @e[tag=Oph_ChooseRes_d1, type=minecraft:marker, sort=nearest, limit=1]
scoreboard objectives remove Oph_ChooseVar_d1