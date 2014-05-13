/**
 * Created by dan on 2014-05-13.
 */

Whatsdue.Courses = DS.Model.extend({
    courseId:           DS.attr('string'),
    courseDescription:  DS.attr('string'),
    adminID:            DS.attr('string')

});

Whatsdue.Courses.FIXTURES = [
    {
        id: 28,
        courseId: "asd",
        courseDescription: "asdfasdf",
        adminID: "assdf"
    },
    {
        id: 29,
        courseId: "asd",
        courseDescription: "Dan",
        adminID: "dan"
    },
    {
        id: 30,
        courseId: "Test",
        courseDescription: "sad",
        adminID: "assdf"
    },
    {
        id: 31,
        courseId: "dan",
        courseDescription: "asd",
        adminID: "dan"
    },
    {
        id: 32,
        courseId: "dan",
        courseDescription: "asd",
        adminID: "dan"
    }
];