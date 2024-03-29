import React, {useState} from 'react';
import { Form, Row, Col, Card, Button, InputGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import InvoiceItem from "./InvoiceItem";
import { v4 as uuidv4 } from 'uuid';
import InvoiceModal from "./InvoiceModal";


const InvoiceForm = () => {
    const [state, setState] = useState({
        isOpen: false,
        currency: '$',
        currentDate: '',
        invoiceNumber: 1,
        dateOfIssue: '',
        billTo: '',
        billToEmail: '',
        billToAddress: '',
        billFrom: '',
        billFromEmail: '',
        billFromAddress: '',
        notes: '',
        total: '0.00',
        subTotal: '0.00',
        taxRate: '',
        taxAmount: '0.00',
        discountRate: '',
        discountAmount: '0.00',
        items: [
            {
                id: '0',
                name: '',
                description: '',
                price: '1.00',
                quantity: 1,
            },
        ],
    });

    const editField = (event) => {
        let fieldName = event.target.name;
        let fieldNewValue = event.target.value;
        console.log(fieldName);
        console.log(fieldNewValue);
        setState((prevState)=> {
           return {...prevState,
                [fieldName]: fieldNewValue,
        }});
        handleCalculateTotal();
        console.log(state);
    };

    const onItemEdit = (evt) => {
        const { id, name, value } = evt.target;
        const updatedItems = state.items.map((item) => {
            if (item.id === id) {
                return {
                    ...item,
                    [name]: value,
                };
            }
            return item;
        });
        setState((prevState) => ({
            ...prevState,
            items: updatedItems,
        }));
        handleCalculateTotal();
    };

    const handleCalculateTotal = () => {
        setState(prevState => {
            const { items, taxRate, discountRate } = prevState;

            const subTotal = items.reduce((sum, item) => sum + parseFloat(item.price) * parseInt(item.quantity, 10), 0);
            const subTotalString = subTotal.toFixed(2);

            const calculateAmount = (rate) => (subTotal * (rate / 100)).toFixed(2);

            const taxAmount = calculateAmount(taxRate);
            const discountAmount = calculateAmount(discountRate);

            const total = (subTotal - parseFloat(discountAmount) + parseFloat(taxAmount)).toFixed(2);

            return { ...prevState, subTotal: subTotalString, taxAmount, discountAmount, total };
        });
    };
    const handleAddEvent = () => {
        const newItem = {
            id: uuidv4(), // Use uuid to generate a unique ID
            name: '',
            price: '1.00',
            description: '',
            quantity: 1,
        };
        console.log('Generated id for new item:', newItem.id);
        setState(prevState => ({
            ...prevState,
            items: [...prevState.items, newItem],
        }));
    };
    const handleRowDel = (items) => {
        const itemsCopy = [...state.items];
        const index = itemsCopy.indexOf(items);
        itemsCopy.splice(index, 1);
        setState({ ...state, items: itemsCopy });
    };

    const onCurrencyChange = (selectedOption) => {
        setState({ ...state, ...selectedOption });
    };
    const openModal = (event) => {
        event.preventDefault()
        handleCalculateTotal()
        // setState({isOpen: true})
        setState((prevState)=> {
            return {...prevState,isOpen: true};
        });
    };

   const closeModal = (event) => {
       setState((prevState)=> {
           return {...prevState,isOpen: false};
       });
   };
    return (
        <Form onSubmit={openModal}>
            <Row>
                <Col md={8} lg={9}>
                    <Card className="p-4 p-xl-5 my-3 my-xl-4">
                        <div className="d-flex flex-row align-items-start justify-content-between mb-3">
                            <div className="d-flex flex-column">
                                <div className="d-flex flex-column">
                                    <div className="mb-2">
                                        <span className="fw-bold">Current&nbsp;Date:&nbsp;</span>
                                        <span className="current-date">{new Date().toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="d-flex flex-row align-items-center">
                                    <span className="fw-bold d-block me-2">Due&nbsp;Date:</span>
                                    <Form.Control type="date" value={state.dateOfIssue} name={"dateOfIssue"} onChange={(event) => editField(event)} style={{
                                        maxWidth: '150px'
                                    }} required="required"/>
                                </div>
                            </div>
                            <div className="d-flex flex-row align-items-center">
                                <span className="fw-bold me-2">Invoice&nbsp;Number:&nbsp;</span>
                                <Form.Control type="number" value={state.invoiceNumber} name={"invoiceNumber"} onChange={(event) => editField(event)} min="1" style={{
                                    maxWidth: '70px'
                                }} required="required"/>
                            </div>
                        </div>
                        <hr className="my-4"/>
                        <Row className="mb-5">
                            <Col>
                                <Form.Label className="fw-bold">Bill to:</Form.Label>
                                <Form.Control placeholder={"Who is this invoice to?"} rows={3} value={state.billTo} type="text" name="billTo" className="my-2" onChange={(event) => editField(event)} autoComplete="name" required="required"/>
                                <Form.Control placeholder={"Email address"} value={state.billToEmail} type="email" name="billToEmail" className="my-2" onChange={(event) => editField(event)} autoComplete="email" required="required"/>
                                <Form.Control placeholder={"Billing address"} value={state.billToAddress} type="text" name="billToAddress" className="my-2" autoComplete="address" onChange={(event) => editField(event)} required="required"/>
                            </Col>
                            <Col>
                                <Form.Label className="fw-bold">Bill from:</Form.Label>
                                <Form.Control placeholder={"Who is this invoice from?"} rows={3} value={state.billFrom} type="text" name="billFrom" className="my-2" onChange={(event) => editField(event)} autoComplete="name" required="required"/>
                                <Form.Control placeholder={"Email address"} value={state.billFromEmail} type="email" name="billFromEmail" className="my-2" onChange={(event) => editField(event)} autoComplete="email" required="required"/>
                                <Form.Control placeholder={"Billing address"} value={state.billFromAddress} type="text" name="billFromAddress" className="my-2" autoComplete="address" onChange={(event) => editField(event)} required="required"/>
                            </Col>
                        </Row>
                       <InvoiceItem onItemizedItemEdit={onItemEdit} onRowAdd={handleAddEvent} onRowDel={handleRowDel} currency={state.currency} items={state.items}/>
                        <Row className="mt-4 justify-content-end">
                            <Col lg={6}>
                                <div className="d-flex flex-row align-items-start justify-content-between">
                  <span className="fw-bold">Subtotal:
                  </span>
                                    <span>{state.currency}
                                        {state.subTotal}</span>
                                </div>
                                <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                                    <span className="fw-bold">Discount:</span>
                                    <span>
                    <span className="small ">({state.discountRate || 0}%)</span>
                                        {state.currency}
                                        {state.discountAmount || 0}</span>
                                </div>
                                <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                  <span className="fw-bold">Tax:
                  </span>
                                    <span>
                    <span className="small ">({state.taxRate || 0}%)</span>
                                        {state.currency}
                                        {state.taxAmount || 0}</span>
                                </div>
                                <hr/>
                                <div className="d-flex flex-row align-items-start justify-content-between" style={{
                                    fontSize: '1.125rem'
                                }}>
                  <span className="fw-bold">Total:
                  </span>
                                    <span className="fw-bold">{state.currency}
                                        {state.total || 0}</span>
                                </div>
                            </Col>
                        </Row>
                        <hr className="my-4"/>
                        <Form.Label className="fw-bold">Notes:</Form.Label>
                        <Form.Control placeholder="Thanks for your business!" name="notes" value={state.notes} onChange={(event) => editField(event)} as="textarea" className="my-2" rows={1}/>
                    </Card>
                </Col>
                <Col md={4} lg={3}>
                    <div className="sticky-top pt-md-3 pt-xl-4">
                        <Button variant="primary" type="submit" className="d-block w-100">Review Invoice</Button>
                        <InvoiceModal showModal={state.isOpen} closeModal={closeModal} info={state} items={state.items} currency={state.currency} subTotal={state.subTotal} taxAmmount={state.taxAmount} discountAmmount={state.discountAmount} total={state.total}/>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Currency:</Form.Label>
                            <Form.Select onChange={event => onCurrencyChange({currency: event.target.value})} className="btn btn-light my-1" aria-label="Change Currency">
                                <option value="$">USD (United States Dollar)</option>
                                <option value="£">GBP (British Pound Sterling)</option>
                                <option value="¥">JPY (Japanese Yen)</option>
                                <option value="$">CAD (Canadian Dollar)</option>
                                <option value="$">AUD (Australian Dollar)</option>
                                <option value="$">SGD (Signapore Dollar)</option>
                                <option value="¥">CNY (Chinese Renminbi)</option>
                                <option value="₿">BTC (Bitcoin)</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="my-3">
                            <Form.Label className="fw-bold">Tax rate:</Form.Label>
                            <InputGroup className="my-1 flex-nowrap">
                                <Form.Control name="taxRate" type="number" value={state.taxRate} onChange={(event) => editField(event)} className="bg-white border" placeholder="0.0" min="0.00" step="0.01" max="100.00"/>
                                <InputGroup.Text className="bg-light fw-bold text-secondary small">
                                    %
                                </InputGroup.Text>
                            </InputGroup>
                        </Form.Group>
                        <Form.Group className="my-3">
                            <Form.Label className="fw-bold">Discount rate:</Form.Label>
                            <InputGroup className="my-1 flex-nowrap">
                                <Form.Control name="discountRate" type="number" value={state.discountRate} onChange={(event) => editField(event)} className="bg-white border" placeholder="0.0" min="0.00" step="0.01" max="100.00"/>
                                <InputGroup.Text className="bg-light fw-bold text-secondary small">
                                    %
                                </InputGroup.Text>
                            </InputGroup>
                        </Form.Group>
                    </div>
                </Col>
            </Row>
        </Form>
    );
};

export default InvoiceForm;
