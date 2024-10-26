[Home](help/home)
/ Energy Meters

# Meters

The **energy package** allows you to configure your own **meters**, which serve as placeholder for different elements, such as contract conditions or energy signals. Depending on the type of energy meters, the signals and contract settings will differ.


<a name="edit-energy-meters"></a>

## Create and edit meters

To create a meter click on the button
<button fill="outline" class="ion-no-margin" ng-reflect-fill="outline" ng-reflect-disabled="false" title="Add new item"> Add new</button>
. A window will appear, with the following fields:

### General settings

* **Public:** this indicates whether a meter is public or not. A public meter can be seen by all users that have access to the used meters.

* **Name:** type a name for a meter. Bear in mind that you may end up having many meters so it is considered good practice to select names that are useful to identify a meter from the rest.

* **Description:** allows adding additional descriptive text to the meter. It can be very helpful in order to perform more specific searches.

* **Owner:** select the owner of the meter.

* **Type:** allows selecting among different types  of meters, based on the magnitude that is being measured (heat, electricity...).

* **Country:** allows selecting among different countries. This is used to load different options for the rest of the tabs in the form.

* **Reference:** *(Optional)* the meter reference.

* **Timezone:** enter the timezone for this meter, this will be used to show the data in the different charts based on this timezone.

* **Address:** *(Optional)* street address of the meter, just descriptive.

* **Latitude, Longitude:** *(Optional)* latitude and longitude coordinates of the meter. Used in the charts that incorporate meter location. Must be input in decimal format. (e.g: 54.345678)

* **Client:** *(Optional)* select the client of the meter. This user will be able to see but not edit the meter details and will be able to generate reports. He will also recieve emails with the meter reports if the report is configured accordingly (*Visible to client*).

* **Logo:** *(Optional)* choose a logo image for the meter.


## View meter details

You can view the meter details by clicking on the meter name.

## Delete meter

You can delete a meter by clicking on the 
<button type="button" class="btn btn-danger"><div class="button-content" style=""><span class="icon"><i class="mdi mdi-delete"></i></span></div></button>
button of its row. Only the meter owners can delete the meters.


## Edit meter

There are two ways to edit a meter's public status:

* **Editing the meter:** clicking the <button type="button" class="btn btn-default"><div class="button-content" style=""><span class="icon"><i class="mdi mdi-pencil"></i></span></div></button> button opens the edit meter window, where you can modify its configuration.

* **Button on the *Public* column:** clicking directly on the <button type="button" class="btn btn-default"><div class="button-content" style=""><span class="icon"><i class="mdi mdi-eye"></i></span></div></button> button located on the *Public* column modifies its state (public or private) without the need of opening the edit meter window.

---

## Related content

* [Nodes](help/nodes)
* [Energy meter details](help/energy_meters_details)

