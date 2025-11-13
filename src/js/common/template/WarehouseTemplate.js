export default class WarehouseTemplate {
  activeWarehouse = (data) => {
    return `<tr>
              <td>${data.name}</td>
              <td>${data.address}</td>
              
              <td class="">
                <div class="d-flex flex-column gap-2 flex-sm-row">
                  <button
                    type="button"
                    class="btn p-0"
                    onclick="viewWarehouseDetails('${data._id}')"
                    data-bs-toggle="modal"
                    data-bs-target="#viewWarehouseModal"
                    data-bs-whatever="@getbootstrap"
                  >
                    <i class="fa fa-eye"></i>
                  </button>

                  <button
                  class="btn p-0"
                  id="addWarehouseBtn"
                  data-bs-toggle="modal"
                  data-bs-target="#editWarehouseModal"
                  onclick = "editWarehouse('${data._id}')"
                  >
                    <i class="fa fa-edit"></i>
                    </button>

                  <button type="button" onclick="deleteWarehouse('${data._id}')" data-bs-toggle="modal" class="btn p-0 text-danger" data-bs-target="#deleteWarehouseModal">
                    <i class="fa fa-trash-o"></i>
                  </button>
                </div>
              </td>
              
            </tr>`;
  };

  emptyWarehouse = () => {
    return `<tr>
              <td>No Warehouse Found.</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>`;
  };
}
