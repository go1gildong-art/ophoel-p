"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.format = format;
const lexer_js_1 = require("../compiler/lexer.js");
const parser_js_1 = require("../compiler/parser.js");
const printer_js_1 = require("./printer.js");
const errors_js_1 = require("../errors.js");
const code = `
/# assume the executor and coordinates is set to the gate's anchor
let mut ii = 0;
let mut offset_x = -3;
let mut offset_y = 0;
let mut offset_z = -1;

let mut anchor_x = 0;
let mut anchor_y = config.room_s.height - 1;
let mut anchor_z = config.room_s.radius + config.room_s.corridors.length - 1;

let mut root_x = 0;
let mut root_y = config.room_s.height - 1;
let mut root_z = config.room_s.radius * -1;

let mut anchor_offset_x = config.room_s.radius;

repeat(config.cardinals.length) {
  let cardinal = config.cardinals[ii];

  /# 1. place the gate structure
  mc_exec(\`if entity @s[tag=gate_\${cardinal}]\`) {
    place!!(\`template realms_2.0:chapter_1/beginning/gate ~\${offset_x} ~\${offset_y} ~\${offset_z} \${config.mc_rotation[ii]}\`);
  }
  let temp_z = offset_z;
  offset_z = offset_x;
  offset_x = -1 * temp_z;
  ii += 1;
  /.
  /# 2. detect or create a room anchor beyond
  let anchor_pos = \`~\${anchor_x} ~\${anchor_y} ~\${anchor_z}\`;
  let anchor_pos_negative = \`~\${anchor_x * -1} ~\${anchor_y * -1} ~\${anchor_z * -1}\`;

  let root_pos = \`~\${root_x} ~\${root_y} ~\${root_z}\`;
  let root_pos_negative = \`~\${root_x * -1} ~\${root_y * -1} ~\${root_z * -1}\`;

  // if an anchor there is not found...
  mc_exec(\`positioned \${anchor_pos} unless entity @e[type=markerblocks:marker_block, tag=\${config.room_anchor_tag}, distance=..1]\`) {
    mc_exec(\`positioned \${anchor_pos_negative}\`) {
    let mut room_type: string; 
    let boss_cond = \`\`;

    // summon boss room anchor, if root room is basecamp AND gate faces north
      // check if the root room is basecamp
      mc_exec(\`positioned \${root_pos} if entity @e[type=markerblocks:marker_block, tag=\${config.room_tags.type.basecamp}, distance=..1]\`) {
        // conditional to ensure the gate faces north
          mc_exec(\`if entity @s[tag=gate_north]\`) {
          // go to anchor's position
          mc_exec(\`positioned \${root_pos_negative} positioned \${anchor_pos}\`) {
          setblock!!(\`~ ~ ~ markerblocks:marker_block{markerTags: ["\${config.room_anchor_tag}", "\${config.room_tags.type.boss]}"]}\`); // boss
          }
        }
      }

    let root_temp_z = root_z;
    root_z = root_x;
    root_x = -1 * root_temp_z;

    // if not on basecamp
    mc_exec(\`positioned \${root_pos} unless entity @e[type=markerblocks:marker_block, tag=\${config.room_tags.type.basecamp}, distance=..1]\`) {
      // go to anchor's position
      mc_exec(\`positioned \${root_pos_negative} positioned \${anchor_pos}\`) {
          // set random room type
    choose (4) {
      room_type = config.room_types[0]; // ambient
      setblock!!(\`~ ~ ~ markerblocks:marker_block{markerTags: ["\${config.room_anchor_tag}", "\${config.room_tags.type[room_type]}"]}\`);
    } or (4) {
      room_type = config.room_types[1]; // battle
      setblock!!(\`~ ~ ~ markerblocks:marker_block{markerTags: ["\${config.room_anchor_tag}", "\${config.room_tags.type[room_type]}"]}\`);
    } or (2) {
      room_type = config.room_types[4]; // elite. jumped 2 and 3, for basecamp and boss
      setblock!!(\`~ ~ ~ markerblocks:marker_block{markerTags: ["\${config.room_anchor_tag}", "\${config.room_tags.type[room_type]}"]}\`);
    } or (4) {
      room_type = config.room_types[5]; // event
      setblock!!(\`~ ~ ~ markerblocks:marker_block{markerTags: ["\${config.room_anchor_tag}", "\${config.room_tags.type[room_type]}"]}\`);
    } or (2) {
      room_type = config.room_types[6]; // treasure
      setblock!!(\`~ ~ ~ markerblocks:marker_block{markerTags: ["\${config.room_anchor_tag}", "\${config.room_tags.type[room_type]}"]}\`);
    }
          }
    }

    // if on basecamp, but not north (or logic with above block)
      mc_exec(\`positioned \${root_pos} if entity @e[type=markerblocks:marker_block, tag=\${config.room_tags.type.basecamp}, distance=..1]\`) {
        // conditional to ensure the gate faces north
          mc_exec(\`unless entity @s[tag=gate_north]\`) {
          // go to anchor's position
          mc_exec(\`positioned \${root_pos_negative} positioned \${anchor_pos}\`) {
          // set random room type
    choose (4) {
      room_type = config.room_types[0]; // ambient
      setblock!!(\`~ ~ ~ markerblocks:marker_block{markerTags: ["\${config.room_anchor_tag}", "\${config.room_tags.type[room_type]}"]}\`);
    } or (4) {
      room_type = config.room_types[1]; // battle
      setblock!!(\`~ ~ ~ markerblocks:marker_block{markerTags: ["\${config.room_anchor_tag}", "\${config.room_tags.type[room_type]}"]}\`);
    } or (2) {
      room_type = config.room_types[4]; // elite. jumped 2 and 3, for basecamp and boss
      setblock!!(\`~ ~ ~ markerblocks:marker_block{markerTags: ["\${config.room_anchor_tag}", "\${config.room_tags.type[room_type]}"]}\`);
    } or (4) {
      room_type = config.room_types[5]; // event
      setblock!!(\`~ ~ ~ markerblocks:marker_block{markerTags: ["\${config.room_anchor_tag}", "\${config.room_tags.type[room_type]}"]}\`);
    } or (2) {
      room_type = config.room_types[6]; // treasure
      setblock!!(\`~ ~ ~ markerblocks:marker_block{markerTags: ["\${config.room_anchor_tag}", "\${config.room_tags.type[room_type]}"]}\`);
    }
          }
        }
      }
  }
}

  let anchor_temp_z = anchor_z;
  anchor_z = anchor_x;
  anchor_x = -1 * anchor_temp_z;
  /.
  /# 3. replace the gate lamp
  let mut jj = 0;
  repeat(config.room_types.length) {
    let room_type = config.room_types[jj];

    // type check for room beyond
    mc_exec(\`positioned \${anchor_pos} if entity @e[type=markerblocks:marker_block, tag=\${config.room_tags.type[room_type]}, distance=..1]\`) {

      // go back to the gate position
      mc_exec(\`positioned \${anchor_pos_negative}\`) { 

        // get to where gate lamp marker is
        mc_exec(\`at @e[type=markerblocks:marker_block, tag=\${config.gate_lamp_tag}, \${config.shortcuts.near1}]\`) {
          setblock!!(\`~ ~ ~ \${config.gate_lamps.type[room_type]}\`);
        }
      }
    }
    jj += 1;
  }
}/.

`;
const config = { room_anchor_tag: "room_anchor", room_s: { radius: 7, tag: "room_s" } };
function format(sourceCode, config, fileName) {
    try {
        // 1. Raw text to Tokens
        let tokens = (0, lexer_js_1.tokenize)(sourceCode, config, fileName);
        // 2. parse tokens to get ast
        let ast = (0, parser_js_1.parse)(tokens);
        // 3. reconstruct source from ast
        let newSource = (0, printer_js_1.rePrint)(ast);
        return newSource;
    }
    catch (err) {
        if (err instanceof errors_js_1.OphoelParseError) {
            console.error("formatting failed due to parse error: " + err.message);
            return sourceCode;
        }
        throw err;
    }
}
// console.log("");
// console.log(tokenize(code, config, "source.oph"));
// console.log(JSON.stringify(parse(tokenize(code, config, "source.oph"))) + "\n");
console.log(format(code, config, "source.oph") + "\n\n");
//# sourceMappingURL=formatter.js.map