import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { Pagination, PaginationProps } from "antd"
import "./commonPagination.scss";
import { useState } from "react";
const CommonPagination = (props: any) => {
    const {total, setLimit, setOffset, positionStatic, currentPage, handlePagination} = props;
    const [current, setCurrentPage] = useState(1);
    
    const applyPagination = (page: any, pageSize: any) => {
      console.log("pageSize", pageSize)
      setCurrentPage(page);
      let offset = (page-1) * pageSize;
      handlePagination(offset, pageSize)
      // setLimit(pageSize);
      // setOffset(offset);
    }

    const itemRender: PaginationProps['itemRender'] = (_, type, originalElement) => {
        if (type === 'prev') {
          return <div className="prev-button jc">
            <ArrowLeftOutlined style={{color:"#257A8C"}} className="arrowLeft"/>
            <div style={{fontSize:"14px",fontFamily:"Roboto-Regular",color:"#257A8C"}}>Prev</div>
            </div>;
        }
        if (type === 'next') {
          return <div className="next-button jc">
            <div style={{fontSize:"14px",fontFamily:"Roboto-Regular",color:"#257A8C"}}>Next </div><ArrowRightOutlined style={{color:"#257A8C", margin:"0px 10px"}}  className="arrowRight"/></div>;
        }
        return originalElement;
    };

    // return(
    //     <div className="jf" style={{margin:"0px 40px"}}>{total > 10 ? <Pagination className="commonPagination" onChange={(e: any) => paginationCond(e)} total={total} itemRender={itemRender} locale={{items_per_page:"rows"}} onShowSizeChange={(i:any, limit: any) => {setLimit(limit)}} showSizeChanger/>:<></>}</div>
    // )

     return(
      <>
      <div
          className={`jf ${total > 50 ? '' : 'hidePagination'} ${positionStatic && 'static'}`} >
          <Pagination className="commonPagination jf" 
          onChange={applyPagination} 
          current={currentPage}
          total={total} 
          itemRender={itemRender} 
          locale={{items_per_page:"rows"}} 
          defaultPageSize={50}
          onShowSizeChange={(i:any, limit: any) =>{ applyPagination(i ,limit)}} 
          showSizeChanger={total > 50}
          pageSizeOptions	={[50,100,150]}
          />
      </div>
      </>
    )
}

export default CommonPagination;