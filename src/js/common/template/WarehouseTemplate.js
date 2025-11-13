export default class WarehouseTemplate {
  activeWarehouse = () => {
    return `<tr>
              <td>Warehouse - A</td>
              <td>15/B, Park Street, Kolkata - 700016</td>
              <td class="">
                <div class="d-flex flex-column gap-2 flex-sm-row">
                  <button
                    type="button"
                    class="btn p-0"
                    data-bs-toggle="modal"
                    data-bs-target="#viewWarehouse"
                    data-bs-whatever="@getbootstrap"
                  >
                    <i class="fa fa-eye"></i>
                  </button>

                  <button class="btn p-0"><i class="fa fa-edit"></i></button>
                  <button class="btn p-0 text-danger">
                    <i class="fa fa-trash-o"></i>
                  </button>
                </div>
              </td>
              <td><span class="status-badge status-active">Active</span></td>
            </tr>`;
  };

  inactiveWarehouse = () => {
    return `<tr>
              <td>Warehouse - C</td>
              <td>42/D, Salt Lake City, Kolkata - 700091</td>
              <td class="">
                <div class="d-flex flex-column gap-2 flex-sm-row">
                  <button
                    type="button"
                    class="btn p-0"
                    data-bs-toggle="modal"
                    data-bs-target="#viewWarehouse"
                    data-bs-whatever="@getbootstrap"
                  >
                    <i class="fa fa-eye"></i>
                  </button>

                  <button class="btn p-0"><i class="fa fa-edit"></i></button>
                  <button class="btn p-0 text-danger">
                    <i class="fa fa-trash-o"></i>
                  </button>
                </div>
              </td>
              <td>
                <span class="status-badge status-inactive">Inactive</span>
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
