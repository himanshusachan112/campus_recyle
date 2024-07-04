import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { apiConnector } from "../../../utils/Apiconnecter";
import { authroutes } from "../../../apis/apis";
import Spinner from "react-bootstrap/Spinner";

function ProductRequestElim({ request, handleDeleteProductRequest }) {
  const [isScheduled, setIsScheduled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [scheduleData, setScheduleData] = useState(null);
  const [scheduleFormData, setScheduleFormData] = useState({
    venue: "",
    time: "",
    date: "",
  });

  const handleScheduleOnchange = (e) => {
    setScheduleFormData({
      ...scheduleFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleScheduleMeet = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const api_header = {
        Authorization: `Bearer ${localStorage.getItem("campusrecycletoken")}`,
        "Content-Type": "multipart/form-data",
      };
      const bodyData = {
        requestid: request._id,
        venue: scheduleFormData.venue,
        date: scheduleFormData.date,
        time: scheduleFormData.time,
        sellername: request.seller.firstname + request.seller.lastname,
        productid: request.product._id,
      };
      const response = await apiConnector(
        "POST",
        authroutes.SCHEDULE_MEET,
        bodyData,
        api_header
      );
      console.log(response.data);
      if (response.data.success) {
        console.log("Meeting Scheduled successfully");
        setIsScheduled(true);
        setIsLoading(false);
      }else{
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleDeleteSchedule = async() => {
    setIsLoading(true);
    try {
      const api_header = {
        Authorization: `Bearer ${localStorage.getItem("campusrecycletoken")}`,
        "Content-Type": "multipart/form-data",
      };
      const bodyData = {
        requestid: request._id
      };
      const response = await apiConnector(
        "POST",
        authroutes.DELETE_SCHEDULED_MEET,
        bodyData,
        api_header
      );
      console.log(response.data);
      if (response.data.success) {
        console.log("Scheduled meeting deleted successfully");
        setIsScheduled(false);
        setIsLoading(false);
      }else{
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  const fetchScheduleData = async () => {
    try {
      const api_header = {
        Authorization: `Bearer ${localStorage.getItem("campusrecycletoken")}`,
        "Content-Type": "multipart/form-data",
      };
      const bodyData = {
        requestid: request._id,
      };
      const response = await apiConnector(
        "POST",
        authroutes.GET_SCHEDULE_DATA,
        bodyData,
        api_header
      );
      console.log(response.data);
      if (response.data.success) {
        console.log("Meeting is already scheduled");
        setScheduleData(response.data.data);
        setIsScheduled(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchScheduleData();
  }, []);
  return (
    <>
      {/* <div className="item-badge-product-request">
        Scheduled
      </div> */}
      <div className="requested-product-item">
        <div className="requested-product-item-img">
          <img src={request.product.images[0]} alt="" />
          <div className="product-info">
            <b>{request.product.productname}</b>
            <p>{request.product.productdescription}</p>
            <b>&#8377; {request.product.price}</b>
          </div>
        </div>
        <div className="requested-product-item-status">
          <p>
            <b>Seller name: </b>
            {request.seller.firstname} {request.seller.lastname}
          </p>
          <p>
            <b>Seller email: </b>
            {request.seller.email}
          </p>
          <p>
            <b>Date: </b>
            {`${new Date(request.requestdate)
              .getDate()
              .toString()
              .padStart(2, "0")}/${new Date(request.requestdate)
              .getMonth()
              .toString()
              .padStart(2, "0")}/${new Date(
              request.requestdate
            ).getFullYear()}`}
          </p>
        </div>
        <div className="requested-product-item-btns">
          {isScheduled && (
            <button
              className="schedule-btn"
              data-bs-toggle="modal"
              data-bs-target={`#schedule_data_view_product_request_modal-${request._id}`}
            >
              Get Schedule Data
              {isLoading && (
                <Spinner className="product-meet-schedule-spinner" />
              )}
            </button>
          )}
          <button
            className="delete-btn"
            data-bs-toggle="modal"
            data-bs-target={`#delete_product_request_modal-${request._id}`}
          >
            <Trash2 />
          </button>
        </div>
      </div>
      
      <div
        class="modal fade"
        id={`delete_product_request_modal-${request._id}`}
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
                Delete Product
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <div className="delete-action-edit-product">
                <button className="cancel-btn" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button
                  className="delete-btn"
                  data-bs-dismiss="modal"
                  onClick={() => {
                    handleDeleteProductRequest(request._id);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* View Schedule data starts here */}
      <div
        class="modal fade"
        id={`schedule_data_view_product_request_modal-${request._id}`}
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
                Schedule Data
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <div className="schedule-data-view-container">
                <div className="schedule-data-view-component">
                  <h6>Seller details: </h6>
                  <div className="schedule-data-view-component-content">
                    <div>
                      <b>Name </b>
                      <p>{request.seller.firstname + request.seller.lastname} </p>
                    </div>
                    <div>
                      <b>Email </b>
                      <p>{request.seller.email} </p>
                    </div>
                    <div>
                      <b>Requested on </b>
                      <p>{request.requestdate} </p>
                    </div>
                  </div>
                </div>
                <div className="schedule-data-view-component">
                  <h6>Meeting details: </h6>
                  <div className="schedule-data-view-component-content">
                    <div>
                      <b>Venue </b>
                      <p>{scheduleData && scheduleData.venue} </p>
                    </div>
                    <div>
                      <b>Date </b>
                      <p>{scheduleData && scheduleData.date} </p>
                    </div>
                    <div>
                      <b>Time </b>
                      <p>{scheduleData && scheduleData.time} </p>
                    </div>
                  </div>
                </div>
                <div className="schedule-data-view-buttons">
                  <button data-bs-dismiss="modal" onClick={handleDeleteSchedule}>Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductRequestElim;
