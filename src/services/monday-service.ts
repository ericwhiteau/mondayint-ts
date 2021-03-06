import initMondayClient from 'monday-sdk-js';

class MondayService {
  static async getColumnValue(token, itemId, columnId) {
    try {
      const mondayClient = initMondayClient();
      mondayClient.setToken(token);

      const query = `query($itemId: [Int], $columnId: [String]) {
        items (ids: $itemId) {
          column_values(ids:$columnId) {
            value
          }
        }
      }`;
      const variables = { columnId, itemId };

      const response = await mondayClient.api(query, { variables });
      return response.data.items[0].column_values[0].value;
    } catch (err) {
      console.log(err);
    }
  }
  static async queryboard (token, boardId, columnId)  {
    try {
      const mondayClient = initMondayClient();
      mondayClient.setToken(token);
  
      const variables = { columnId, boardId };
      // console.log("variables", variables);
  
      const query = `query($boardId: [Int], $columnId: [String]) {
          boards (ids: $boardId) {
            items{
              column_values(ids:$columnId) {
                value
                text
              }
            }
          }
        }`;
      
  
      const response = await mondayClient.api(query, { variables });
      return response.data.boards[0].items;
    } catch (err) {
      console.error(err);
    }
  };
  
  static async getColumnText (token, itemId, columnId)  {
    try {
      const mondayClient = initMondayClient();
      mondayClient.setToken(token);
  
      const query = `query($itemId: [Int], $columnId: [String]) {
          items (ids: $itemId) {
            column_values(ids:$columnId) {
              value
              text
            }
          }
        }`;
      const variables = { columnId, itemId };
  
      const response = await mondayClient.api(query, { variables });
      return response.data.items[0].column_values[0].text;
    } catch (err) {
      console.error(err);
    }
  };

  static async changeColumnValue(token, boardId, itemId, columnId, value) {
    try {
      const mondayClient = initMondayClient({ token });

      const query = `mutation change_column_value($boardId: Int!, $itemId: Int!, $columnId: String!, $value: JSON!) {
        change_column_value(board_id: $boardId, item_id: $itemId, column_id: $columnId, value: $value) {
          id
        }
      }
      `;
      const variables = { boardId, columnId, itemId, value };

      const response = await mondayClient.api(query, { variables });
      return response;
    } catch (err) {
      console.log(err);
    }
  }
}

export default MondayService;
