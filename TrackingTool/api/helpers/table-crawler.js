module.exports = {
  friendlyName: 'Table Crawler',


  description: 'Return a personalized greeting based on the provided name.',
  sync: true,


  inputs: {
    start: {
      type: 'ref',
      description: 'Start Index',
      required: true
    },
    sheet: {
      type: 'ref',
      description: 'Working Excel Worksheet',
      required: true
    },
  },


  fn: function (input, exits) {
    var res = "<tr>\n"
    res += "<th>Test n°</th>\n"
    res += "<th>Hp (ft)</th>\n"
    res += "<th>W/delta (tons)</th>\n"
    res += "<th>Mach</th>\n"
    res += "<th>D Specific Range (%)</th>\n"
    res += "</tr>\n"
    var data = input.sheet[input.start].v
    var idx = input.start;
    var start_idx = input.start;
    while (data !== "") {
      res += "<tr>\n"
      res += sails.helpers.thWrap(data)
      idx = sails.helpers.columnShift(start_idx)
      res += sails.helpers.thWrap(input.sheet[idx].v)
      idx = sails.helpers.columnShift(idx)
      res += sails.helpers.thWrap(input.sheet[idx].v)
      idx = sails.helpers.columnShift(idx)
      res += sails.helpers.thWrap(input.sheet[idx].v)
      idx = sails.helpers.columnShift(idx)
      res += sails.helpers.thWrap(input.sheet[idx].v)
      start_idx = sails.helpers.rowShift(start_idx);
      console.log("DEBUGGGGGGGG")
      console.log(start_idx)
      data = input.sheet[start_idx].v;
      console.log(data === "")
      console.log(data === "\n")
      res += "</tr>\n"
    }
    exits.success(res);
  },
}
